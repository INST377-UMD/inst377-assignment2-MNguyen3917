if (annyang) {
  const commands = {
    'hello': () => alert('Hello!'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      const pages = {
        home: 'index.html',
        stocks: 'stocks.html',
        dogs: 'dogs.html'
      };
      if (pages[page]) {
        window.location.href = pages[page];
      }
    },
    'lookup *ticker': (ticker) => {
      document.getElementById('ticker').value = ticker.toUpperCase();
      document.getElementById('days').value = '30'; 
      lookupStock();
    }
  };
  annyang.addCommands(commands);
}

async function lookupStock() {
  const ticker = document.getElementById('ticker').value.toUpperCase();
  const days = document.getElementById('days').value;
  const limit = parseInt(days);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - limit);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  const API_KEY = 'j_0P1GBEt9pPKeTrLm5g1gf8yGnybef1';
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStart}/${formattedEnd}?adjusted=true&sort=asc&limit=${limit}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      alert('No data found for this stock ticker.');
      return;
    }

    const labels = data.results.map(entry => {
      const date = new Date(entry.t);
      return date.toISOString().split('T')[0];
    });

    const values = data.results.map(entry => entry.c);

    const ctx = document.getElementById('stockChart').getContext('2d');
    if (window.myChart) {
      window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: values,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Failed to fetch stock data.');
  }
}

async function loadRedditStocks() {
  try {
    const response = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
    const stocks = await response.json();
    const top5 = stocks.slice(0, 5);

    const tableBody = document.getElementById('reddit-stocks');
    tableBody.innerHTML = '';

    top5.forEach(stock => {
      const tr = document.createElement('tr');

      const tickerCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      link.textContent = stock.ticker;
      link.target = "_blank";
      tickerCell.appendChild(link);

      const commentsCell = document.createElement('td');
      commentsCell.textContent = stock.no_of_comments;

      const sentimentCell = document.createElement('td');
      let sentimentImg = document.createElement('img');
      sentimentImg.width = 20;

      if (stock.sentiment === 'Bullish') {
        sentimentImg.src = 'bull.png';
      } else {
        sentimentImg.src = 'bear.png';
      }

      sentimentCell.appendChild(sentimentImg);

      tr.appendChild(tickerCell);
      tr.appendChild(commentsCell);
      tr.appendChild(sentimentCell);

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error loading Reddit stocks:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadRedditStocks);
