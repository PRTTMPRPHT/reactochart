import {mount} from 'enzyme';
import React from 'react';
import {XYPlot, YAxisTitle} from '../../src';

describe('YAxisTitle', () => {
    it('Check how many labels are created and where', () => {
        const xyProps = {
            width: 500,
            height: 360,
            xDomain: [0, 100],
            yDomain: [0, 100],
        };

        const tree = (
            <XYPlot {...xyProps}>
                <YAxisTitle title="AAAA" alignment="top"/>

                <YAxisTitle title="EEEE" alignment="middle" rotate={false}/>
                <YAxisTitle title="IIII" alignment="bottom" placement="after"/>

                <YAxisTitle
                    title="JJJJ"
                    alignment="top"
                    placement="after"
                    rotate={false}
                />

                <YAxisTitle title="MMMM" alignment="top" position="right"/>
                <YAxisTitle
                    title="RRRR"
                    alignment="bottom"
                    position="right"
                    rotate={false}
                />

                <YAxisTitle
                    title="TTTT"
                    alignment="middle"
                    placement="before"
                    position="right"
                />
            </XYPlot>
        );

        // Positions will be slightly off since jest-canvas-mock does not provide a proper implementation
        // for measureText.

        const rendered = mount(tree).find(YAxisTitle);
        expect(rendered.at(0).props().alignment).toEqual('top');
        expect(
            rendered
                .at(0)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(-5,0)');
        expect(rendered.at(1).props().rotate).toEqual(false);
        expect(
            rendered
                .at(1)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(-5,180)');
        expect(rendered.at(2).props().placement).toEqual('after');
        expect(
            rendered
                .at(2)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(5,360)');
        expect(rendered.at(3).props().rotate).toEqual(false);
        expect(
            rendered
                .at(3)
                .find('text')
                .first()
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('rotate(0)');
        expect(
            rendered
                .at(4)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(447,0)');
        expect(
            rendered
                .at(5)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(447,360)');
        expect(
            rendered
                .at(6)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(437,180)');
        expect(
            rendered
                .at(6)
                .find('text')
                .first()
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('rotate(-90)');
    });
});
