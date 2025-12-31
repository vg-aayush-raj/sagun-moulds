import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { employeeApi, Employee } from '../../../api/employeeApi';
import { attendanceApi, Attendance } from '../../../api/attendanceApi';

interface AttendanceTrackerProps {
  refresh: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function AttendanceTracker({ refresh, onSuccess, onError }: AttendanceTrackerProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState<Map<number, Partial<Attendance>>>(new Map());
  const [loading, setLoading] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, [refresh]);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate();
    }
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeApi.list({ status: 'active' });
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendanceForDate = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const data = await attendanceApi.list({
        start_date: dateStr,
        end_date: dateStr,
      });
      setExistingAttendance(data);

      // Pre-fill attendance records
      const recordsMap = new Map<number, Partial<Attendance>>();
      data.forEach((att) => {
        recordsMap.set(att.employee_id, att);
      });
      setAttendanceRecords(recordsMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (employeeId: number, field: string, value: any) => {
    setAttendanceRecords((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(employeeId) || {};
      newMap.set(employeeId, { ...existing, [field]: value });
      return newMap;
    });
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.format('YYYY-MM-DD');

      const records = Array.from(attendanceRecords.entries())
        .filter(([_, record]) => record.status)
        .map(([employeeId, record]) => ({
          employee_id: employeeId,
          check_in_time: record.check_in_time,
          check_out_time: record.check_out_time,
          status: record.status!,
          notes: record.notes,
        }));

      if (records.length > 0) {
        await attendanceApi.bulkCreate({ date: dateStr, records });
        onSuccess();
        fetchAttendanceForDate();
      }
    } catch (error: any) {
      onError(error.response?.data?.error || 'Error saving attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' | 'info' => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'half_day':
        return 'warning';
      case 'leave':
        return 'info';
      case 'overtime':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="contained" onClick={handleSaveAttendance} disabled={loading} fullWidth sx={{ height: 56 }}>
            {loading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </Grid>
      </Grid>

      {loading && employees.length === 0 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check-In</TableCell>
                  <TableCell>Check-Out</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => {
                  const record = attendanceRecords.get(employee.id!) || {};
                  const existing = existingAttendance.find((a) => a.employee_id === employee.id);
                  const isLocked = existing?.is_locked;

                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.employee_id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        {existing ? (
                          <Chip
                            label={existing.status}
                            color={getStatusColor(existing.status || '')}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ) : (
                          <TextField
                            select
                            size="small"
                            value={record.status || ''}
                            onChange={(e) => handleAttendanceChange(employee.id!, 'status', e.target.value)}
                            sx={{ minWidth: 120 }}
                            disabled={isLocked}
                          >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                            <MenuItem value="half_day">Half Day</MenuItem>
                            <MenuItem value="leave">Leave</MenuItem>
                            <MenuItem value="overtime">Overtime</MenuItem>
                          </TextField>
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          size="small"
                          value={record.check_in_time || existing?.check_in_time || ''}
                          onChange={(e) => handleAttendanceChange(employee.id!, 'check_in_time', e.target.value)}
                          disabled={isLocked || !!existing}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          size="small"
                          value={record.check_out_time || existing?.check_out_time || ''}
                          onChange={(e) => handleAttendanceChange(employee.id!, 'check_out_time', e.target.value)}
                          disabled={isLocked || !!existing}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={record.notes || existing?.notes || ''}
                          onChange={(e) => handleAttendanceChange(employee.id!, 'notes', e.target.value)}
                          disabled={isLocked || !!existing}
                          sx={{ width: 150 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
