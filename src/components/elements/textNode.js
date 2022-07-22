export const addTextNode = (
  stage,
  layer,
  textNode,
  transformer,
  setUpdatedText
) => {
  textNode.hide();
  transformer.hide();
  transformer.keepRatio(true);
  layer.batchDraw();
  let textPosition = textNode.absolutePosition();
  let stageBox = stage.container().getBoundingClientRect();
  let areaPosition = {
    x: stageBox.left + textPosition.x,
    y: stageBox.top + textPosition.y,
  };
  let textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.classList.add('node-textarea');
  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y + 'px';
  textarea.style.left = areaPosition.x + 'px';
  textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
  textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
  textarea.style.fontSize = textNode.fontSize() + 'px';
  textarea.style.border = '1px dashed lightgrey';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = textNode.lineHeight();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();
  textarea.style.whiteSpace = 'normal';
  textarea.style.textAlign = 'center';
  textarea.style.textAlignLast = 'center';
  textarea.style.verticalAlign = 'middle';
  let rotation = textNode.rotation();
  let transform = '';
  if (rotation) {
    transform += 'rotateZ(' + rotation + 'deg)';
  }
  let px = 0;
  let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += 'translateY(-' + px + 'px)';
  textarea.style.transform = transform;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 3 + 'px';
  textarea.focus();

  function removeTextarea() {
    textNode.text(textarea.value);
    if (textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
      window.addEventListener('click', handleOutsideClick);
      textNode.show();
      transformer.show();
      // transformer.forceUpdate();
      layer.batchDraw();
    }
  }
  function setTextareaWidth(newWidth) {
    if (!newWidth) {
      // set width for placeholder
      newWidth = textNode.placeholder.length * textNode.fontSize();
    }
    // some extra fixes on different browsers
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }
    let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }
    textarea.style.width = newWidth + 'px';
    textNode.setAttr('width', newWidth);
  }
  textarea.addEventListener('keydown', function (e) {
    // on esc do not set value back to node
    if (e.keyCode === 27) {
      removeTextarea();
    }
  });
  textarea.addEventListener('keydown', function (e) {
    let scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
    textNode.setAttr('height', textarea.scrollHeight + textNode.fontSize());
  });

  textarea.oninput = (e) => setUpdatedText(e.target.value);

  function handleOutsideClick(e) {
    if (e.target !== textarea) {
      removeTextarea();
    }
  }
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });
};
