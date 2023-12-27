export default {
  type: "object",
  properties: {
    file: { type: 'string' },
    fileName: { type: 'string' }
  },
  required: ['file']
} as const;
