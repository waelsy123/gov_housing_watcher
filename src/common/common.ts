export const selectOption = async (page, selectorStr, desiredValue, optionValue) => {
  const element = await page.$(selectorStr);
  element.select(desiredValue);

  const value = await page.$eval(selectorStr, (el: any) => {
    return el.selectedIndex
  });

  if (value === 0) {
    return await selectOption(page, selectorStr, desiredValue, optionValue)
  }
}

export const setTextInput = async (page, selectorStr, value) => {
  await page.$eval(selectorStr, (el, value) => { el.value = value }, value);

  const result = await page.$eval(selectorStr, (el: any) => {
    return el.value
  });

  if (!result) {
    return await setTextInput(page, selectorStr, value)
  }
}

export const removeElement = async (page: any, div_selector_to_remove: any) => {
  await page.evaluate((sel) => {
    var elements = document.querySelectorAll(sel);
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }, div_selector_to_remove);
}

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}