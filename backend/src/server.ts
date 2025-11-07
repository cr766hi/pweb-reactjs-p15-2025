import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 IT Literature Shop API Ready!`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health-check`);
});