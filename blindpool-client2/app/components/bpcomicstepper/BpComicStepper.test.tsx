import {fireEvent, render, waitFor} from "@testing-library/react";
import BpComicStepper from "./BpComicStepper";
import '../../locales/i18n';

describe('Test how to page', () => {

    test('Step through stepper and verify descriptions', async () => {
        const {getByText} = render(<BpComicStepper/>);

        const comic1DescriptionPart = getByText(/watch a football/i);
        expect(comic1DescriptionPart).toBeInTheDocument();

        let currentComicDisplayer = getByText('1 / 6');
        expect(currentComicDisplayer).toBeInTheDocument();

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();

        fireEvent.click(nextButton);

        await waitFor(() => {
            getByText('2 / 6');
        });

        const comic2DescriptionPart = getByText(/For example two euros/i);
        expect(currentComicDisplayer).toBeInTheDocument();
        expect(comic2DescriptionPart).toBeInTheDocument();
    });
});