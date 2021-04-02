const slide=document.getElementsByClassName('slide');
const dots=document.querySelectorAll('.welcomeCarousel_indicators div');
const button=document.querySelector(".welcomeCarousel_Button button");
const welcomeScreen=document.querySelector(".welcome-screen");
const skipBtn=document.querySelector(".skipBtn");
const mainSection=document.querySelector('.mainsection');
const swapImage=document.querySelector(".swap-image");
const allElements=document.querySelector(".app");
const windowsLoader=document.querySelector(".windows-loader");
const dropdown1=document.getElementById('currencyList1');
const dropdown2=document.getElementById('currencyList2');
const dropdown3=document.getElementById('currencyList3');
const dropdown4=document.getElementById('select2');
const generateBtn=document.querySelector('.generateBtn');
const textbox=document.getElementById("textbox");
const results=document.querySelector('.results');
const loader=document.querySelector('.loader');
const fluctuation=document.querySelector('.currfluctuate');
const c1text=document.querySelector(".c1text");
const c1code=document.getElementById("c1code");
const c2text=document.querySelector(".currency2text");
const c2code=document.querySelector(".currency2code");
const currfluctuate=document.querySelector(".currfluctuate");
const slider=document.querySelector('.slider-list');
const gerReportLoader=document.querySelector('#genReport');
const Reportpage=document.querySelector('#genReportPage');
const downloadReport=document.querySelector('.reportDownload');
const InitReportPage=document.querySelector('#genReportTemp');
const mainpage=document.querySelector(".mainpage");
let blob;
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 3)
const ntoday=today.toISOString().slice(0,10)
const nyesterday=yesterday.toISOString().slice(0,10);
//animations and welcome page handler
function dotHandler() {
    if (slide[0].classList.contains("d-block")) {
        dots[0].classList.add('dot-background');
    }
    else if (slide[1].classList.contains("d-block")) {
        dots[0].classList.remove('dot-background');
        dots[1].classList.add('dot-background');

    }
    else if (slide[2].classList.contains("d-block")) {
        dots[1].classList.remove('dot-background');
        dots[2].classList.add('dot-background');
    }
    else
    {
        dots[2].classList.remove('dot-background');
        dots[3].classList.add('dot-background');
        button.textContent="Start";
    }  
}
dotHandler();
    
    button.addEventListener('click',()=>{
        if (slide[0].classList.contains("d-block")) {
            slide[0].classList.replace("d-block","d-none");
            slide[1].classList.replace("d-none","d-block");
            dotHandler();
    }
    else  if (slide[1].classList.contains("d-block")) {
        slide[1].classList.replace("d-block","d-none");
        slide[2].classList.replace("d-none","d-block");
        dotHandler();
     }
     else  if (slide[2].classList.contains("d-block")) {
        slide[2].classList.replace("d-block","d-none");
        slide[3].classList.replace("d-none","d-block");
        dotHandler();
     }
    else
    {
        if (button.innerHTML=="Start") {
            welcomeScreen.classList.add('d-none');
             mainpage.classList.toggle('d-none');
        }
    }
    });
    skipBtn.addEventListener('click',()=>{
        welcomeScreen.classList.add('d-none');
        mainpage.classList.toggle('d-none');
    });

    function httpRequest(url,type) {
        return fetch(url).then(response=>{
         if (response.status>=200&response.status<300) {
                if (type==="csv") {
                  return response.text();  
                }
                else
                {
                    return response.json();
                }
            }
            else
            {
              alert('error with request')
            }
        }).catch(error=>{
            alert("Error handling request");
        })
    }

    function swapInput() {
        const temp=dropdown1.value;
        dropdown1.value=dropdown2.value;
        dropdown2.value=temp
    }
    function processDate(date) {
const oldDate = new Date(today)
      switch (date) {
          case "3d":
            oldDate.setDate(oldDate.getDate() - 3)
            return oldDate.toISOString().slice(0,10);
              break;
            case "5d":
                oldDate.setDate(oldDate.getDate() - 5)
                return oldDate.toISOString().slice(0,10);
                  break;
            case "1w":
                    oldDate.setDate(oldDate.getDate() - 7)
                    return oldDate.toISOString().slice(0,10);
                      break;
            case "2w":
                        oldDate.setDate(oldDate.getDate() - 14)
                        return oldDate.toISOString().slice(0,10);
                          break;
            case "1m":
                        oldDate.setDate(oldDate.getDate() - 30)
                        return oldDate.toISOString().slice(0,10);
                          break;
          default:
              break;
      }
    }

  async function liveRates() {
    let temp='';
      const flucRate=await httpRequest(`https://api.exchangerate.host/fluctuation?start_date=${nyesterday}&end_date=${ntoday}&base=USD&symbols=EUR,BTC,XOF,JPY,CNY,HKD,NPW,KRW,NGN,XAF,RUB,ETH,UAH,RON,MXN,IQD,INR,ILS,IDR,HUF,GHS` ,'json');
      Object.entries(flucRate.rates).forEach(ele=>{
          if (ele[1].change<0) {
              temp+=`
              <div class="list-item">
  <h4 class="red-text" style="font-weight:600;">${ele[0]}</h4>
  <img src="./assets/images/icons8_arrow_pointing_down.ico" alt="" width="15%">
  <h4 style="font-weight: 600;" class="red-text">${ele[1].change.toFixed(6)}</h4>
</div>
              `;
          }
          else
          {
            temp+=`
            <div class="list-item">
            <h4 class="greentext" style="font-weight:600;">${ele[0]}</h4>
            <img src="./assets/images/icons8_long_arrow_up.ico" alt="" width="15%" class="mb-4">
            <h4 style="font-weight: 600;" class="greentext">${ele[1].change.toFixed(6)}</h4>
          </div>
            `;
          }
      })
      slider.innerHTML=temp;
  }

    dropdown1.addEventListener('change',convertRateHandler); 
    dropdown2.addEventListener('change',convertRateHandler);
    textbox.addEventListener('input',()=>{
      convertRateHandler();
    });

     function convertRateHandler() {
        const currency1code=dropdown1.value;
        const currency2code=dropdown2.value;
        let currentRate;
            results.classList.add('d-none');
            loader.classList.remove('d-none');
            Promise.all([httpRequest(`https://api.exchangerate.host/latest?base=${currency1code}&symbols=${currency2code}&amount=${textbox.value}&source=crypto`,'json'),httpRequest(`https://api.exchangerate.host/fluctuation?start_date=${nyesterday}&end_date=${ntoday}&base=${currency1code}&symbols=${currency2code}&source=crypto`,'json')]).then(response=>{
                c1text.innerHTML=`${textbox.value}<span class="greentext" >${currency1code}</span>=${response[0].rates[currency2code].toFixed(2)}<span class="greentext">${currency2code}</span>`;
                currentRate=response[0].rates[currency2code];
                if (response[1].rates[currency2code].change<0) {
                    currfluctuate.innerHTML=response[1].rates[currency2code].change;
                    currfluctuate.classList.remove('greentext');
                    currfluctuate.classList.add('red-text');
                }
                else 
                {
                    currfluctuate.innerHTML=response[1].rates[currency2code].change;
                    currfluctuate.classList.add('greentext');
                    currfluctuate.classList.remove('red-text');
                }
                 
                loader.classList.add('d-none');
                results.classList.remove('d-none');
            });
           
    }
    

    swapImage.addEventListener('click',()=>{
           swapImage.classList.toggle('spin');
           swapInput();
           convertRateHandler();
    });


async function generateReport() {
    try {
        Reportpage.classList.add('d-none');
        InitReportPage.classList.add('d-none');
        gerReportLoader.classList.toggle('d-none');
        const reportDate=processDate(dropdown4.value);
        const tempVal=dropdown3.value;
        const report=await httpRequest(`https://api.exchangerate.host/timeseries?start_date=${reportDate}&end_date=${ntoday}&base=${tempVal}&format=csv`,"csv");
         blob= new Blob([report],{type:'text/csv'});
         gerReportLoader.classList.toggle('d-none');
         Reportpage.classList.remove('d-none');
        
    } catch (error) {
        alert("request error");
    }
   
}
generateBtn.addEventListener('click',()=>{
    generateReport();
})
downloadReport.addEventListener('click',(event)=>{
    event.preventDefault();
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.setAttribute('hidden','');
    a.setAttribute('href',url);
    a.setAttribute('download','download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
    window.addEventListener('load',()=>{
    convertRateHandler();
    liveRates();
     windowsLoader.classList.add('d-none');
    allElements.classList.remove('d-none');
    });
