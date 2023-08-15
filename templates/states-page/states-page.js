async function updateSection(section) {
 // extract grid elements 
 const defaultContent = section.querySelector('.default-content-wrapper');
 const attributes = section.querySelector('.columns.attributes');
 const ps = section.querySelectorAll('p');
 const img1 = ps[0].firstElementChild;
 img1.classList.add('state-pic1');
 const p1 = ps[1];
 p1.classList.add('state-des1');
 const img2 = ps[2].firstElementChild;
 img2.classList.add('state-pic2');
 const p2 = ps[3];
 p2.classList.add('state-des2');

 // create updated state section
 const updatedStateSection = document.createElement('div');
 updatedStateSection.classList.add('updated-state-section');
 updatedStateSection.appendChild(defaultContent);
 updatedStateSection.appendChild(attributes);
 updatedStateSection.appendChild(img1);
 updatedStateSection.appendChild(p1);
 updatedStateSection.appendChild(img2);
 updatedStateSection.appendChild(p2);

 // clean redundant childs
 while (section.firstChild) {
  section.removeChild(section.firstChild);
 }
 // append arranged city section under original city section
 section.appendChild(updatedStateSection);
}

let queue = 0;
/**
 * Perform some metering on a repeated function call to reduce the chances to block the CPU/GPU
 * for too long.
 * @param {function} fn The function to execute repeatedly
 * @param {number} [wait] The delay to wait between batch executions, defaults to 200ms
 * @param {number} [max] The number of function executions to trigger on each pass, defaults to 5
 * @returns a promise that the functions were all called
 */
export async function meterCalls(fn, wait = 200, max = 5) {
 queue += 1;
 return new Promise((resolve) => {
  window.requestAnimationFrame(async () => {
   await fn.call(null);
   if (queue >= max) {
    queue -= max;
    setTimeout(() => resolve(),wait);
   } else {
    resolve();
   }
  });
 });
}

export function loadLazy() {
 const stateSections = Array.from(document.querySelectorAll('.section.state'));
 stateSections.forEach((section) => meterCalls(() => updateSection(section)));
}