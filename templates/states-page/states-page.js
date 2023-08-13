function updateSection(section) {
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


export function loadEager() {
 return false;
}

export function loadLazy() {
 return false;
}