import { mount } from 'enzyme';
import React from 'react';
import { XAxisLabels, XYPlot } from '../../src';

describe('XAxisLabel', () => {
  it('Check how many labels are created and where', () => {
    const chartStyle = { marginBottom: '10px' };
    const functions = {
      onMouseEnterLabel: jest.fn(),
      onMouseMoveLabel: jest.fn(),
      onMouseLeaveLabel: jest.fn(),
      onMouseClickLabel: jest.fn(),
    };
    const tree = (
      <div>
        <div style={chartStyle}>
          <XYPlot
            width={400}
            height={150}
            xDomain={[-20, 20]}
            yDomain={[-20, 20]}
          >
            <XAxisLabels {...functions} />
            <XAxisLabels position="top" distance={2} tickCount={5} />
          </XYPlot>
        </div>
      </div>
    );
    const rendered = mount(tree).find(XAxisLabels);
    const first = rendered.first();
    // each tick is a g and there's a wrapper around all g's, hence the 10 and 6
    expect(first.find('g')).toHaveLength(10);
    expect(rendered.at(1).find('g')).toHaveLength(6);

    expect(rendered.at(1).props().position).toEqual('top');
    expect(first.props().position).toEqual('bottom');

    const firstChild = first.find('g').at(2);

    expect(first.props().onMouseEnterLabel).not.toHaveBeenCalled();
    firstChild.simulate('mouseenter');
    expect(first.props().onMouseEnterLabel).toHaveBeenCalledTimes(1);

    expect(first.props().onMouseMoveLabel).not.toHaveBeenCalled();
    firstChild.simulate('mousemove');
    expect(first.props().onMouseMoveLabel).toHaveBeenCalledTimes(1);

    expect(first.props().onMouseLeaveLabel).not.toHaveBeenCalled();
    firstChild.simulate('mouseleave');
    expect(first.props().onMouseLeaveLabel).toHaveBeenCalledTimes(1);

    expect(first.props().onMouseClickLabel).not.toHaveBeenCalled();
    firstChild.simulate('click');
    expect(first.props().onMouseClickLabel).toHaveBeenCalledTimes(1);
  });

  it('Renders labels with given format and styles', () => {
    const tree = (
      <XYPlot width={400} height={150} xDomain={[-20, 20]} yDomain={[-20, 20]}>
        <XAxisLabels
          format={d => `${d}%`}
          position="top"
          distance={2}
          tickCount={5}
          labelStyle={label => {
            return {
              fill: label.text === '0%' ? 'green' : 'blue',
            };
          }}
        />
      </XYPlot>
    );

    const rendered = mount(tree).find(XAxisLabels);
    const labelWrapper = rendered.first('g');
    const labels = labelWrapper.children().find('text');

    const correctTickLabels = ['-20%', '-10%', '0%', '10%', '20%'];

    const renderedTickLabels = labels.map(label => {
      const instance = label.instance();
      const textContent = instance.textContent;
      const expectedStyles = Object.assign(
        XAxisLabels.defaultProps.labelStyle,
        {
          fill: textContent === '0%' ? 'green' : 'blue',
        },
      );

      Object.keys(expectedStyles).forEach(styleKey => {
        // Parse to int if lineHeight
        const styleValue =
          styleKey === 'lineHeight'
            ? parseInt(instance.style[styleKey], 10)
            : instance.style[styleKey];

        expect(expectedStyles[styleKey]).toEqual(styleValue);
      });

      return textContent;
    });

    expect(renderedTickLabels).toEqual(correctTickLabels);
  });

  it('Renders date labels given formats array', () => {
    // jest-canvas-mock has no real implementation of measureText,
    // and instead counts each character as one pixel wide.
    // For this reason, the dimensions here are set to a small value so we can test for
    // collisions.

    const tree = (
      <XYPlot
        width={50}
        height={150}
        xDomain={[new Date('01/01/2015'), new Date('01/01/2019')]}
        yDomain={[-20, 20]}
      >
        <XAxisLabels
          formats={['%B %d, %Y', '%m/%Y']}
          position="top"
          distance={2}
          tickCount={5}
        />
      </XYPlot>
    );

    const rendered = mount(tree).find(XAxisLabels);
    const labelWrapper = rendered.first('g');
    const labels = labelWrapper.children().find('text');

    // Logic should pick the "%m/%Y" format since "%B %d, %Y"
    // which would format the labels like so January 30, 2015, would have too many collisions when rendered
    const correctTickLabels = [
      '01/2015',
      '01/2016',
      '01/2017',
      '01/2018',
      '01/2019',
    ];

    const renderedTickLabels = labels.map(label => {
      const instance = label.instance();
      const textContent = instance.textContent;
      return textContent;
    });

    expect(renderedTickLabels).toEqual(correctTickLabels);
  });

  it('Renders number labels given formats array', () => {
    // jest-canvas-mock has no real implementation of measureText,
    // and instead counts each character as one pixel wide.
    // For this reason, the dimensions here are set to a small value so we can test for
    // collisions.

    const tree = (
      <XYPlot width={19} height={150} xDomain={[-1, 1]} yDomain={[-20, 20]}>
        <XAxisLabels
          formats={['+20', '.0%']}
          position="top"
          distance={2}
          tickCount={5}
        />
      </XYPlot>
    );

    const rendered = mount(tree).find(XAxisLabels);
    const labelWrapper = rendered.first('g');
    const labels = labelWrapper.children().find('text');

    // Logic should pick the ".0%" format since "+20"
    // would have too many collisions when rendered
    const correctTickLabels = ['−100%', '−50%', '0%', '50%', '100%'];

    const renderedTickLabels = labels.map(label => {
      const instance = label.instance();
      const textContent = instance.textContent;
      return textContent;
    });

    console.log(renderedTickLabels);

    expect(renderedTickLabels).toEqual(correctTickLabels);
  });
});
