function updateSection(section) {
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

function observeSection(section) {
 const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
   if (mutation.attributeName !== 'class') {
    return;
   }
   if (mutation.target.classList.contains('attributes')) {
    updateSection(section);
   }
  });
 });

 observer.observe(section, {attributes: true, subtree: true});
}

export function loadLazy() {
 const stateSections = Array.from(document.querySelectorAll('.section.state'));
 stateSections.forEach(observeSection);
}