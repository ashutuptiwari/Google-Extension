let button = document.getElementById("button");
let content1 = document.getElementById("scraped-content1");
let content2 = document.getElementById("scraped-content2");
let content3 = document.getElementById("analysis-result");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.html) {
    content1.textContent = request.html;
  }
  if (request.text) {
    content2.textContent = request.text;
  }
  if (request.date||request.time||request.duration) {
    const time=request.time;
    const date=request.date;
    const duration =request.duration;
    const timezone= request.timezone;
    content3.textContent = `DATE:${date} TIME:${time}  DURATION:${duration} TIMEZONE:${timezone}`;
  } else {
    content3.textContent = "Pata nhi kya hoagaya bc";
  }
});

button.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    function: scrapeEmailContent,
  });
});

async function scrapeEmailContent() {
  const h2Element = document.querySelector('h2[jsname="r4nke"].hP');
  const paragraph = document.querySelector(".a3s.aiL");
  let message = {};

  if (h2Element && paragraph) {
    message.html = h2Element.textContent;
    message.text = paragraph.textContent;
  } else if (h2Element) {
    message.html = h2Element.textContent;
    message.text = "Content not found";
  } else if (paragraph) {
    message.text = paragraph.textContent;
    message.html = "Subject not found";
  } else {
    message.html = "Subject not found";
    message.text = "Content not found";
  }
  const text = paragraph.textContent;
  const url = "https://ai-textraction.p.rapidapi.com/textraction";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "122e1b8b9cmshee53e94722d9c72p164196jsnecec0fe800bb",
      "X-RapidAPI-Host": "ai-textraction.p.rapidapi.com",
    },
    body: JSON.stringify({
      text: text,
      entities: [
        {
          description: "any date in the text and convert them dd/mm/yyyy format and always take year to be 2023 unless otherwise mentioned in the text",
          type: "string",
          var_name: "date",
        },
        {
          description: "any duration in the text in minutes or hours or days",
          type: "string",
          var_name: "duration",
        },
        {
          description: "any time mentioned in the text in HHMM format",
          type: "string",
          var_name: "time",
        },
        {
          description: "TIMEZONE CODE OF THREE LETTERSfor example GMT,UTC, if nothing mentioned use IST",
          type: "string",
          var_name: "timezone",
        }
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    message.date = result.results.date;
    message.time =  result.results.time;
    message.duration =  result.results.duration;
    message.timezone=result.results.timezone;
  } catch (error) {
    console.error(error);
    message.date = error;
  }

  chrome.runtime.sendMessage(message);
}
