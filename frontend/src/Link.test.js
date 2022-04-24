//import App from './App';
import React from 'react'
import { shallow, mount } from 'enzyme';
import Link from '../Link';



describe("Counter testing", () =>{

  let wrapper;
  beforeEach(() =>{
    wrapper = shallow(<Link/>);
  });

  test('renders learn react link', () => {
    
    expect(wrapper.find('h1').text()).toContain("Hola");
  });

  test("render a button with text of 'increment'",() => {
    expect(wrapper.find('#increment-btn').text()).toBe("Increment");
  })

  test("render the initial value of stte in a div", () => {
    expect(wrapper.find("#counter-value").text()).toBe("0");
  })

  test("render the click event of increment button and increment counter value", () =>{
    wrapper.find('#increment-btn').simulate('click');
    expect(wrapper.find("#counter-value").text()).toBe("1");
  })

  test("render the click event of decrement button and decrement counter value", () =>{
    wrapper.find('#increment-btn').simulate('click');
    expect(wrapper.find("#counter-value").text()).toBe("1");
    wrapper.find('#decrement-btn').simulate('click');
    expect(wrapper.find("#counter-value").text()).toBe("0");
    wrapper.find('#decrement-btn').simulate('click');
    expect(wrapper.find("#counter-value").text()).toBe("0");
  })
})


