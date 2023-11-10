const queryKeys = {
  parkingLots: {
    default: "parking-lots",
    get: (query?: string) => ["parking-lots", query],
  },
};

export default queryKeys;
