# Fraklin Repeat Sections Long TBT Solution
This repository aims to:
- Reproduce the long TBT issue observed when a single page contains repeated sections (particularly more than 10) with redundant block or CSS usage.
- Provide two potential solutions to the long TBT issue and evaluate their advantages and disadvantages

P.S. I noticed this issue when I was implementing my intern project [petplace.com/traveling-with-a-pet](https://www.petplace.com/traveling-with-a-pet). Thanks to my mentor [@ramboz](https://github.com/ramboz) for inspiring me and guiding me through the process :)

## Reproduce issue
Suppose we're working with a page that lists basic information for all 50 US states. Each state's information is contained within a distinct section in this [document](https://docs.google.com/document/d/1eR4imhaU5-Bm_lBGzXwsSB-uitXKdGggHQt1NvzQOlg/edit?usp=sharing), as shown below:
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/doc-section-sample.png" width="50%">
</p>
Our goal is to present each section on the webpage as illustrated here (though real-world applications may be significantly more complex):
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/state-overview.png" width="50%">
</p>
To achieve this, we'll be using both JavaScript and CSS. The relevant resources are:

- js: [updateSection()](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.js#L1) 
- css: [states_page.css](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.css)

Given the section "decorate" should align with block decorate, this process should also occur in the lazy loading phase. We could implement sections as illustrated below:

[Code Reference](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.js#L33-L36)
```Java
export function loadLazy() {
 const stateSections = Array.from(document.querySelectorAll('.section.state'));
 stateSections.forEach(updateSection);
}
```
Now we have done the implementation! 

The issue can be now easily reproduced on the [**page**](https://main--helix-website-tbt--fentpams.hlx.page/states)(with 6x CPU slow and enough height to show multiple sections):
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/basic-solution.png" width="95%">
</p>

Feel free to try to reproduce it on the page [main--helix-website-tbt--fentpams.hlx.page/states](https://main--helix-website-tbt--fentpams.hlx.page/states)

## Solution 1 - Meter Call

For lengthy pages, it's often preferable to load just the first section initially. This is because users typically view the first section upon opening the page and cannot read the entire page instantly. 

So the first solution is to make `updateSection()` async and have a function to perform some metering on a repeated function call to reduce the chances to block the CPU/GPU for too long. Here's how it can be implemented:

[Code Reference](https://github.com/FentPams/helix-website-tbt/blob/solution-1/templates/states-page/states-page.js#L33-L60)
```Java
let queue = 0;
export async function meterCalls(fn, wait = 200, max = 5) {
 queue += 1;
 return new Promise((resolve) => {
  window.requestAnimationFrame(async () => {
   await fn.call(null);
   if (queue >= max) {
    queue -= max;
    resolve()
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
```

With this adjustment, the issue is mitigated by breaking the lengthy task into smaller tasks
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/metercall-solution.png" width="95%">
</p>

## Solution 2 - Mutation Observer

The second solution is to establish a `MutationObserver` that tracks changes within the section's elements. Once a specific signal is detected (e.g., the addition of a block `class` attribute), it indicates the appropriate time to execute [updateSection()](https://github.com/FentPams/helix-website-tbt/blob/main/templates/states-page/states-page.js#L1). Here's how it can be implemented:

[Code Reference](https://github.com/FentPams/helix-website-tbt/blob/solution-2/templates/states-page/states-page.js#L33-L51)
```Java
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

As we can see on the page [solution-2--helix-website-tbt--fentpams.hlx.page/states](https://solution-2--helix-website-tbt--fentpams.hlx.page/states), the issue is gone:
<p align="center">
<img src="https://github.com/FentPams/helix-website-tbt/blob/main/readme-pic/mutationObserver-solution.png" width="95%">
</p>

## Solution 1 vs Solution 2

|   | Solution 1 - Meter Call  | Soltuion 2 - Mutation Observer  |
|---|---|---|
| Link  | [https://solution-1--helix-website-tbt--fentpams.hlx.page/states](https://solution-1--helix-website-tbt--fentpams.hlx.page/states)  |  [https://solution-2--helix-website-tbt--fentpams.hlx.page/states](https://solution-2--helix-website-tbt--fentpams.hlx.page/states) |
| Pros  | <ul><li>Break down long tasks into small groups to reduce the chances to block the CPU/GPU for too long</li></ul> | <ul><li>Facilitate the rapid and individual updating of sections through callback</li><li>Able to handle race condition issue with block decoration</li></ul>  |
| Cons  | <ul><li>Can not deal with race condition issue with blocks</li><li>Increase latency to load page as it leverages `setTimeout()`</li></ul>  |  <ul><li>Use mutation observer may have a negative performance impact</li></ul> |

## Reference
- [https://main--my-helix-website--fentpams.hlx.live/tbt-detailed-solution](https://main--my-helix-website--fentpams.hlx.live/tbt-detailed-solution)
- [https://main--my-helix-website--fentpams.hlx.live](https://main--my-helix-website--fentpams.hlx.live)

## Environments
- Preview: https://main--helix-website-tbt--fentpams.hlx.page/states
- Live: https://main--helix-website-tbt--fentpams.hlx.live/states

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
