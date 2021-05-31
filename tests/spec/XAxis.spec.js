import { mount } from 'enzyme';
import React from 'react';
import {
  LineChart,
  XAxis,
  XAxisLabels,
  XAxisTitle,
  XGrid,
  XTicks,
  XYPlot,
} from '../../src';

// XAxis tests must run in browser since XAxis uses measureText

describe('XAxis', () => {
  const width = 500;
  const height = 300;
  const props = {
    width,
    height,
    xScaleType: 'linear',
    yScaleType: 'linear',
    marginTop: 11,
    marginBottom: 22,
    marginLeft: 33,
    marginRight: 44,
  };

  it('extends the scale domain if to include custom `ticks` if passed', () => {
    const tree = (
      <XYPlot {...props} xDomain={[0, 10]} yDomain={[0, 10]}>
        <LineChart data={[[0, 0], [10, 10]]} x={d => d[0]} y={d => d[1]} />
        <XAxis ticks={[-5, 0, 5]} />
      </XYPlot>
    );
    const rendered = mount(tree).find(XAxis);

    expect(rendered.props().xDomain).toEqual([-5, 10]);
    expect(rendered.props().yDomain).toEqual([0, 10]);
  });

  it('rounds domain to nice numbers if `nice` option is true', () => {
    const niceXChart = mount(
      <XYPlot {...props}>
        <LineChart
          data={[[0.3, 0.8], [9.2, 9.7]]}
          x={d => d[0]}
          y={d => d[1]}
        />
        <XAxis nice />
      </XYPlot>,
    ).find(LineChart);

    expect(niceXChart.props().xDomain).toEqual([0, 10]);
    expect(niceXChart.props().yDomain).toEqual([0.8, 9.7]);
  });

  it('renders every part of the xAxis', () => {
    const tree = (
      <XYPlot {...props} xDomain={[0, 10]} yDomain={[0, 10]}>
        <XAxis ticks={[-5, 0, 5]} />
      </XYPlot>
    );
    const rendered = mount(tree);
    const line = rendered.find('.rct-chart-axis-line-x');
    expect(rendered.find(XGrid).props().ticks).toHaveLength(3);
    expect(rendered.find(XAxisLabels)).toHaveLength(1);
    expect(rendered.find(XAxisTitle)).toHaveLength(1);
    expect(rendered.find(XTicks)).toHaveLength(1);
    expect(line).toHaveLength(1);
    expect(typeof line.props().x1).toBe('number');
    expect(typeof line.props().x2).toBe('number');
    expect(typeof line.props().y1).toBe('number');
    expect(typeof line.props().y2).toBe('number');
  });

  it('handles mouse events', () => {
    const onMouseEnterAxis = jest.fn();
    const onMouseLeaveAxis = jest.fn();
    const onMouseClickAxis = jest.fn();

    const tree = (
      <XYPlot {...props} xDomain={[0, 10]} yDomain={[0, 10]}>
        <XAxis
          onMouseEnterAxis={onMouseEnterAxis}
          onMouseLeaveAxis={onMouseLeaveAxis}
          onMouseClickAxis={onMouseClickAxis}
          ticks={[-5, 0, 5]}
        />
      </XYPlot>
    );
    const rendered = mount(tree);
    const xAxis = rendered.find(XAxis);

    expect(onMouseEnterAxis).not.toHaveBeenCalled();
    xAxis.simulate('mouseenter');
    expect(onMouseEnterAxis).toHaveBeenCalledTimes(1);

    expect(onMouseLeaveAxis).not.toHaveBeenCalled();
    xAxis.simulate('mouseleave');
    expect(onMouseLeaveAxis).toHaveBeenCalledTimes(1);

    expect(onMouseClickAxis).not.toHaveBeenCalled();
    xAxis.simulate('click');
    expect(onMouseClickAxis).toHaveBeenCalledTimes(1);
  });
});
