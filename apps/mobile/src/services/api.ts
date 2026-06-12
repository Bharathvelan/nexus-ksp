const BASE_URL = 'http://10.23.137.176:3000/api';

export const apiClient = {
  getAlerts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  
  uploadVoiceNote: async (audioUri: string, firId: string) => {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'voice_note.m4a',
      } as any);
      formData.append('fir_id', firId);

      const response = await fetch(`${BASE_URL}/voice-to-text`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
