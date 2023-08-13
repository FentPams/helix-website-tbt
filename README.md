# Fraklin Repeat Sections Long TBT Solution
This repository aims to:
- Reproduce the long TBT issue observed when a single page contains repeated sections (particularly more than 10) with redundant block or CSS usage.
- Offer a solution to address the aforementioned problem.

P.S. I noticed this issue when I was implementing the page [petplace.com/traveling-with-a-pet](https://www.petplace.com/traveling-with-a-pet).

## Reproduce issue
Suppose we're working with a page that lists basic information for all 50 US states. Each state's information is contained within a distinct section in this [document](https://docs.google.com/document/d/1eR4imhaU5-Bm_lBGzXwsSB-uitXKdGggHQt1NvzQOlg/edit?usp=sharing), as shown below:
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/doc-section-sample.png" width="50%">
</p>
Our goal is to present each section on the webpage as illustrated here (though real-world applications may be significantly more complex):
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/page-section-sample.png" width="50%">
</p>
To achieve this, we'll be using both JavaScript and CSS. The relevant resources are:

- js: [updateSection()](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.js#L1) 
- css: [states_page.css](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.css)

Given that the page layout typically waits for the block decoration to finalize (for instance, waiting for a class name to be added to the block before extracting the element to the parent grid div), this process should also occur in the lazy loading phase. Should we implement sections as illustrated below:

[Code Reference](https://github.com/FentPams/helix-website-tbt/blob/method1/templates/states-page/states-page.js#L36-L40)
```
export function loadLazy() {
 const stateSections = Array.from(document.querySelectorAll('.section.state'));
 stateSections.forEach(updateSection);
}
```
Now we have done the implementation! 

The issue can be now easily reproduced on the [**page**](https://method1--helix-website-tbt--fentpams.hlx.page/states)(with 6x CPU slow and enough height to show multiple sections):
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/method1-tbt-issue.png" width="50%">
</p>

Feel free to try to reproduce it on the page [method1--helix-website-tbt--fentpams.hlx.page/states](https://method1--helix-website-tbt--fentpams.hlx.page/states)

## Solution

The solution is to establish a `MutationObserver` that tracks changes within the section's elements. Once a specific signal is detected (e.g., the addition of a block `class` attribute), it indicates the appropriate time to execute [updateSection()](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.js#L1). Here's how it can be implemented:

[Code Reference](https://github.com/FentPams/helix-website-tbt/blob/method2/templates/states-page/states-page.js#L31-L49)
```
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
```

There are mainly 2 benefits of doing by this way:

1. Avoid race condition issues with block decoration, especially since both processes occur in the lazy load phase. In certain scenarios, it's necessary to wait for a block to fully decorate before executing our JavaScript code For example, in [petplace.com/traveling-with-a-pet](https://www.petplace.com/traveling-with-a-pet), `updateSection()` is triggered after columns block add class name `city-footer-txt` into some sub-element(check more details in this [article](https://main--my-helix-website--fentpams.hlx.live/tbt-detailed-solution#final-version)).
2. Leverage the use of an observer to ensure that `updateSection()` is executed in a callback manner. This approach facilitates the rapid and individual updating of sections. 

As we can see on the page [method2--helix-website-tbt--fentpams.hlx.page/states](https://method2--helix-website-tbt--fentpams.hlx.page/states), the issue is gone.

## Reference
- [https://main--my-helix-website--fentpams.hlx.live/tbt-detailed-solution](https://main--my-helix-website--fentpams.hlx.live/tbt-detailed-solution)


## Environments
- Preview: https://main--helix-website-tbt--fentpams.hlx.page/
- Live: https://main--helix-website-tbt--fentpams.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
