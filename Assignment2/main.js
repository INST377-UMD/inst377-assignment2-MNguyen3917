if (annyang) {
  const commands = {
    'hello': () => {
      alert('Hello World!');
    },
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      page = page.toLowerCase();
      if (page.includes('home')) {
        window.location.href = 'index.html';
      } else if (page.includes('stock')) {
        window.location.href = 'stocks.html';
      } else if (page.includes('dog')) {
        window.location.href = 'dogs.html';
      }
    }
  };

  annyang.addCommands(commands);
}
