export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix to get raw base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getMimeTypeFromBase64 = (base64: string): string => {
  const signatures: Record<string, string> = {
    '/9j/': 'image/jpeg',
    'iVBORw0KGgo': 'image/png',
    'R0lGODdh': 'image/gif',
    'R0lGODlh': 'image/gif',
    'Qk02U': 'image/bmp',
  };
  for (const signature in signatures) {
    if (base64.startsWith(signature)) {
      return signatures[signature];
    }
  }
  return 'image/png'; // Default
};