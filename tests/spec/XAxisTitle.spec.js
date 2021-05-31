import {mount} from 'enzyme';
import React from 'react';
import {XAxisTitle, XYPlot} from '../../src';

describe('XAxisTitle', () => {
    it('Check how many labels are created and where', () => {
        const xyProps = {
            width: 500,
            height: 360,
            xDomain: [0, 100],
            yDomain: [0, 100],
        };

        const tree = (
            <XYPlot {...xyProps}>
                <XAxisTitle title="CCCC" alignment="right"/>

                <XAxisTitle title="DDDD" alignment="left" placement="above"/>

                <XAxisTitle title="HHHH" alignment="center" rotate/>

                <XAxisTitle title="JJJJ" alignment="left" placement="above" rotate/>

                <XAxisTitle title="MMMM" position="top" alignment="left"/>

                <XAxisTitle
                    title="PPPP"
                    position="top"
                    alignment="left"
                    placement="below"
                />
                <XAxisTitle title="SSSS" position="top" alignment="left" rotate/>
            </XYPlot>
        );

        // Positions will be slightly off since jest-canvas-mock does not provide a proper implementation
        // for measureText.

        const rendered = mount(tree).find(XAxisTitle);
        expect(rendered.at(0).props().alignment).toEqual('right');
        expect(
            rendered
                .at(0)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(500,307)');
        expect(rendered.at(1).props().placement).toEqual('above');
        expect(
            rendered
                .at(1)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(0,297)');
        expect(rendered.at(2).props().rotate).toEqual(true);
        expect(
            rendered
                .at(2)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(250,307)');
        expect(rendered.at(3).props().rotate).toEqual(true);
        expect(
            rendered
                .at(3)
                .find('text')
                .first()
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('rotate(-90)');
        expect(
            rendered
                .at(4)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(0,-5)');
        expect(
            rendered
                .at(5)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(0,5)');
        expect(
            rendered
                .at(6)
                .getDOMNode()
                .getAttribute('transform'),
        ).toEqual('translate(0,-5)');
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
