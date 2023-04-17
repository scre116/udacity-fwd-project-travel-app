import {handleSubmit} from "../src/client/js/formHandler"

// Mock the required functions and dependencies
global.fetch = require('jest-fetch-mock');

// Set up the jsdom environment
const { JSDOM } = require('jsdom');
const { window } = new JSDOM();
const document  = window.document;
global.document = document;

// Mock the getElementById function
const mockElements = {
    text: { value: 'test-text' },
    polarity: { innerHTML: '' },
    subjectivity: { innerHTML: '' },
    irony: { innerHTML: '' },
    agreement: { innerHTML: '' },
    confidence: { innerHTML: '' },
    'status-line': { innerHTML: '', style: { visibility: '' } },
    'results-table': { style: { visibility: '' } }
};

// Mock the getElementById function
document.getElementById = jest.fn((elementId) => mockElements[elementId]);


describe('handleSubmit', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    test('successful API call', async () => {
        const event = { preventDefault: jest.fn() };
        fetch.mockResponseOnce(JSON.stringify(
            { polarity: 'Negative', 
            subjectivity: 'Subjective', 
            irony: 'Nonironic', 
            agreement: 'Disagreement', 
            confidence: '100'}));

        await handleSubmit(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/analyze?text=test-text');
        expect(mockElements['status-line'].style.visibility).toBe('hidden');
        expect(mockElements['results-table'].style.visibility).toBe('visible');
        expect(mockElements['polarity'].innerHTML).toBe('Negative');
        expect(mockElements['subjectivity'].innerHTML).toBe('Subjective');
        expect(mockElements['irony'].innerHTML).toBe('Nonironic');
        expect(mockElements['agreement'].innerHTML).toBe('Disagreement');
        expect(mockElements['confidence'].innerHTML).toBe('100');

    });

    test('API call with error', async () => {
        const event = { preventDefault: jest.fn() };
        fetch.mockResponseOnce(JSON.stringify({ error: 'An error occurred' }));

        await handleSubmit(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/analyze?text=test-text');
        
        expect(mockElements['status-line'].innerHTML).toBe('Webservice call resulted in an error: "An error occurred"');
        expect(mockElements['status-line'].style.visibility).toBe('visible');
        expect(mockElements['results-table'].style.visibility).toBe('hidden');

    });
});