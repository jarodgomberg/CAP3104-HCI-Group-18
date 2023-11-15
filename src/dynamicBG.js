const body = document.querySelector('body');
const date = new Date();
const hour = date.getHours();
body.style.backgroundRepeat = "no-repeat";
body.style.backgroundSize = "cover";
body.style.backgroundAttachment = "fixed";
if (hour > 6 && hour < 12) {
  body.style.backgroundImage = "url('Images/day.jpg')";
} else if (hour > 12 && hour < 17) {
  body.style.backgroundImage= "url('Images/noon.jpg')";
} else if (hour > 17 && hour < 19) {
    body.style.backgroundImage= "url('Images/evening.jpg')";
}else {
  body.style.backgroundImage= "url('Images/night.jpg.webp')";
}