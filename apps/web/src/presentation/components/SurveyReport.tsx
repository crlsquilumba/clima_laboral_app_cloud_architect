import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Survey, SurveyResponse } from '@/core/entities/Survey';

interface SurveyReportProps {
  survey: Survey;
  responses: SurveyResponse[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const SurveyReport: React.FC<SurveyReportProps> = ({ survey, responses }) => {
  const responseRate = responses.length > 0 ? (responses.length / 100) * 100 : 0; // Assuming target is 100

  const generateChartData = () => {
    const data: any[] = [];
    
    survey.questions.forEach((question, index) => {
      if (question.type === 'multiple_choice' && question.options) {
        const questionData = {
          question: `P${index + 1}`,
          ...question.options.reduce((acc: any, option: string, optIndex: number) => {
            const count = responses.filter(response => {
              const answer = response.answers.find(a => a.questionId === question.id);
              return answer && answer.value === option;
            }).length;
            acc[`Opción ${optIndex + 1}`] = count;
            return acc;
          }, {})
        };
        data.push(questionData);
      }
    });
    
    return data;
  };

  const generatePieData = () => {
    const statusCounts = responses.reduce((acc: any, response) => {
      const status = response.submittedAt ? 'Completada' : 'Pendiente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const chartData = generateChartData();
  const pieData = generatePieData();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reporte de Encuesta: {survey.title}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Respuestas
              </Typography>
              <Typography variant="h4">
                {responses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tasa de Respuesta
              </Typography>
              <Typography variant="h4">
                {responseRate.toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={responseRate} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Preguntas
              </Typography>
              <Typography variant="h4">
                {survey.questions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Estado
              </Typography>
              <Chip 
                label={survey.status} 
                color={survey.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Respuestas por Pregunta
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {survey.questions[0]?.options?.map((_, index) => (
                    <Bar 
                      key={index} 
                      dataKey={`Opción ${index + 1}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Respuestas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Questions Detail */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalle de Preguntas
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableRow>
                      <TableCell>Pregunta</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Respuestas</TableCell>
                      <TableCell>Opciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {survey.questions.map((question, index) => (
                      <TableRow key={question.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{question.text}</TableCell>
                        <TableCell>
                          <Chip 
                            label={question.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {responses.filter(response => 
                            response.answers.some(a => a.questionId === question.id)
                          ).length}
                        </TableCell>
                        <TableCell>
                          {question.options ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {question.options.map((option, optIndex) => (
                                <Chip 
                                  key={optIndex} 
                                  label={option} 
                                  size="small" 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Sin opciones
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
