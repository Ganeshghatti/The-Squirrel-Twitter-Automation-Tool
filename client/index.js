async function processFollowers(event) {
    event.preventDefault();
    const html = document.getElementById('inputArea').value;
    const sheetUrl = document.getElementById('sheetUrl').value.trim();
    if (!sheetUrl) {
      alert("Please enter a Google Sheet URL.");
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = html;
  
    const followers = [];
  
    const usernameDivs = container.querySelectorAll('div[dir="ltr"].r-1wvb978');
    const fullNameDivs = container.querySelectorAll('div[dir="ltr"].css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-b88u0q.r-1awozwy.r-6koalj.r-1udh08x.r-3s2u2q span.css-1jxf684.r-dnmrzs.r-1udh08x.r-1udbk01.r-3s2u2q.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
  
    for (let i = 0; i < usernameDivs.length; i++) {
      const fullNameSpan = fullNameDivs[i]?.querySelector('span span');
      const fullName = fullNameSpan?.innerText.trim() || '';
      const userName = usernameDivs[i]?.innerText.trim() || '';
      const profileLink = `https://x.com/${userName}`;
  
      followers.push({fullName, userName, profileLink });
    }
    // document.getElementById('outputArea').textContent = JSON.stringify(followers, null, 2);
    document.getElementById('err').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
  
    
    try{
      console.log("Followers ", followers)
      console.log("Sheet ",sheetUrl)
      const res = await fetch("http://localhost:3000/add-row",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followers, sheetUrl })
      });
      const result = await res.json();
      console.log("Result ",result)
      alert('Data added to google sheet!!');

      document.getElementById('loader').style.display = 'none';
      // document.getElementById('op').style.display = 'block';
    }
    catch (error) {
        console.error("Error sending data to backend:", error);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('err').style.display = 'block';
        // alert("Failed to send data to backend.");
    }
  }
  
  