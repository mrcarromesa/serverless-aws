export const maskPhone = (value: string): string => {
  let v = value.replace(/\D/g, ''); // Remove tudo o que não é dígito
  v = v.substring(0, 11); // Apenas os 11 primeiros dígitos
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
  return v.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
};

export const maskPhoneWithDDI = (value: string): string => {
  let v = value.replace(/\D/g, '');
  v = v.substring(0, 13);
  v = v.replace(/^(\d{2})(\d{2})(\d)/g, '+$1 $2 $3');
  return v.replace(/(\d)(\d{4})$/, '$1-$2');
};

export const maskCPF = (value: string): string => {
  let v = value.replace(/\D/g, '');
  v = v.substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  return v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCNPJ = (value: string): string => {
  let v = value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/, '$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
  return v.replace(/(\d{4})(\d)/, '$1-$2');
};

export const formatCurrency = (value: number): string => {
  const amount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const result = amount.replace(/,/g, '.');
  const resultAmount = result.replace(
    /([R$]+)([\s])?([\d|.|,]+)([,.])([0-9]{2})$/g,
    '$1 $3,$5',
  );

  return `${resultAmount}`;
};
