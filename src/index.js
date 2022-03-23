/* eslint-disable react/react-in-jsx-scope, react/jsx-filename-extension, no-unused-vars */

/* @jsx createElement */

function createElement(tagName, props, ...children) {
  const element = document.createElement(tagName);

  Object.entries(props || {}).forEach(([key, value]) => {
    element[key.toLowerCase()] = value;
  });

  children.flat().forEach((child) => {
    if (child instanceof Node) {
      element.appendChild(child);
      return;
    }
    element.appendChild(document.createTextNode(child));
  });

  return element;
}

function render(savedOperator, prevInput, savedValue, currentValue) {
  function compute(prevValue, newValue) {
    return {
      '+': prevValue + newValue,
      '-': prevValue - newValue,
      '*': prevValue * newValue,
      '/': prevValue / newValue,
    };
  }

  function areNumbers(input1, input2) {
    return typeof (input1) === 'number' && typeof (input2) === 'number';
  }

  function handleNumber(input) {
    if (areNumbers(prevInput, input)) {
      const value = currentValue * 10 + input;

      render(savedOperator, input, savedValue, value);
      return;
    }
    render(savedOperator, input, savedValue, input);
  }

  function handleEquality(input) {
    const value = compute(savedValue, currentValue)[savedOperator];

    render(null, input, 0, value);
  }

  function haveSavedOperator() {
    return !!savedOperator;
  }

  function handleOperator(input) {
    if (haveSavedOperator()) {
      const value = compute(savedValue, currentValue)[savedOperator];

      render(input, input, value, value);
      return;
    }
    render(input, input, currentValue, currentValue);
  }

  function handleSign(input) {
    if (input === '=') {
      handleEquality(input);
      return;
    }
    handleOperator(input);
  }

  const [zero, ...rest] = [...Array(10).keys()];

  const element = (
    <div>
      <p>간단 계산기</p>
      <p>{currentValue}</p>
      <p>
        {[...rest, zero].map((i) => (
          <button type="button" onClick={() => handleNumber(i)}>
            {i}
          </button>
        ))}
      </p>
      <p>
        {['+', '-', '*', '/', '='].map((sign) => (
          <button type="button" onClick={() => handleSign(sign)}>
            {sign}
          </button>
        ))}
      </p>
    </div>
  );

  const app = document.getElementById('app');
  app.textContent = '';
  app.appendChild(element);
}

render(null, 0, 0, 0);
