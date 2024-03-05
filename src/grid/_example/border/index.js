Component({
  data: {
    img1: 'https://tdesign.gtimg.com/mobile/demos/example1.png',
    img2: 'https://tdesign.gtimg.com/mobile/demos/example2.png',
    img3: 'https://tdesign.gtimg.com/mobile/demos/example3.png',
    border: {
      color: '#f6f6f6',
    },
  },

  lifetimes: {
    attached() {
      const { theme } = wx.getSystemInfoSync();
      if (theme === 'dark') {
        this.setData({ border: { color: '#181818' } });
      }
    },
  },
});
