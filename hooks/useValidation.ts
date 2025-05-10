export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateGlucose = (value: number): boolean => {
  return value >= 40 && value <= 600; // Rango razonable para glucosa en mg/dL
};

export const validateReminder = (reminder: {
  title: string;
  time: Date;
  frequency: string;
}): string[] => {
  const errors: string[] = [];

  if (!reminder.title.trim()) {
    errors.push('El título es requerido');
  }

  if (reminder.time < new Date()) {
    errors.push('La fecha debe ser futura');
  }

  if (!['daily', 'weekly', 'monthly', 'once'].includes(reminder.frequency)) {
    errors.push('Frecuencia inválida');
  }

  return errors;
}; 