import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';

const url = 'https://unsplash.com/s/photos/restaurant';

const scrapeImages = async () => {
  let imageLinks = [];
  let page = 1;

  try {
    while (imageLinks.length < 30) {
      const { data } = await axios.get(`${url}?page=${page}`);
      const $ = cheerio.load(data);

      $('figure img').each((index, element) => {
        const imageUrl = $(element).attr('src');
        if (imageUrl && imageLinks.length < 30) {
          imageLinks.push(imageUrl);
        }
      });

      page++;
    }

    await fs.writeFile('imageLinks.txt', imageLinks.join('\n'));
    console.log('Image links saved to imageLinks.txt');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
};

scrapeImages();
