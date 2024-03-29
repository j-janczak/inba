module.exports = {
  log: (msg) => {
    const D = new Date(),
      d = ('0' + D.getDate()).slice(-2),
      M = ('0' + (D.getMonth() + 1)).slice(-2),
      y = String(D.getFullYear()).slice(-2),
      h = ('0' + D.getHours()).slice(-2),
      m = ('0' + D.getMinutes()).slice(-2),
      s = ('0' + D.getSeconds()).slice(-2);
  
    console.log(`[${h}:${m}:${s} ${d}.${M}.${y}] `.gray + msg);
  },

  dbDateToPL: (date) => {
    date = new Date(date);
    const D = ('0' + date.getDate()).slice(-2),
      M = ('0' + (date.getMonth() + 1)).slice(-2),
      Y = date.getFullYear();
    return `${D}.${M}.${Y}`;
  },

  asyncForEach: async (collection, callback) => {
    for (const element of collection)
      await callback(element);
  }
};

