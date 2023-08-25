import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, waitFor } from '@domino/test-utils/dist/testing-library';
import { forEach } from 'ramda';
import AlertRecipients, * as alertRecipients from '../AlertRecipients';

describe('EmailAlerts', () => {
  const emailAlertsProps = {
    visible: true,
    closeModal: jest.fn(),
    dmmModelId: 'dmm-model-id'
  };

  const emailAlertsStateAndHandlers = {
    alertRecipients: ['someone@dominodatalab.com', 'anotherOne@dominodatalab.com'],
    setAlertRecipients: jest.fn(),
    alertConfigId: null,
    setAlertConfigId: jest.fn(),
    isLoading: false,
    setIsLoading: jest.fn(),
  };

  it('Email Alerts when no config is found', () => {
    const emailAlertsStateAndHandlersCase = {
      ...emailAlertsStateAndHandlers,
      alertRecipients: []
    };
    jest.spyOn(alertRecipients, 'useEmailAlerts').mockReturnValue(emailAlertsStateAndHandlersCase);
    const view = render(<AlertRecipients {...emailAlertsProps} />);
    expect(view.getByRole('combobox').getAttribute('class')).toEqual('ant-select-selection-search-input');
    expect(view.container.querySelector('.ant-select-selection__choice')).toBeFalsy();
  });

  it('Email Alerts when recipients are found', () => {
    const emailAlertsStateAndHandlersCase = {
      ...emailAlertsStateAndHandlers
    };
    jest.spyOn(alertRecipients, 'useEmailAlerts').mockReturnValue(emailAlertsStateAndHandlersCase);
    const view = render(<AlertRecipients {...emailAlertsProps} />);
    expect(view.getAllByText(/@dominodatalab.com/).length).toEqual(2);
  });

  it('Email Alerts when modal is not visible', () => {
    const emailAlertsStateAndHandlersCase = {
      ...emailAlertsStateAndHandlers
    };
    const emailAlertsPropsCase = {
      ...emailAlertsProps,
      visible: false
    };
    jest.spyOn(alertRecipients, 'useEmailAlerts').mockReturnValue(emailAlertsStateAndHandlersCase);
    expect(render(<AlertRecipients {...emailAlertsPropsCase} />).queryByRole('combobox')).toBeFalsy();
  });

  it('handleEmailDeleteWrapper should filter out passed email id', async () => {
    const alertRecipientsAddresses = ['a@dominodatalab.com', 'b@dominodatalab.com'];
    const setAlertRecipients = jest.fn();
    const emailAlertsStateAndHandlersCase = {
      ...emailAlertsStateAndHandlers,
      alertRecipients: alertRecipientsAddresses,
      alertConfigId: '',
      setAlertRecipients
    };
    jest.spyOn(alertRecipients, 'useEmailAlerts').mockReturnValue(emailAlertsStateAndHandlersCase);
    const [, firstEmailDeleteIcon, secondEmailDeleteIcon] = Array.from(
      render(<AlertRecipients {...emailAlertsProps} />).baseElement.querySelectorAll('svg'));

    await userEvent.click(firstEmailDeleteIcon);
    expect(setAlertRecipients).toHaveBeenCalledTimes(1);
    expect(setAlertRecipients).toHaveBeenCalledWith(['b@dominodatalab.com']);

    await userEvent.click(secondEmailDeleteIcon);
    expect(setAlertRecipients).toHaveBeenCalledTimes(2);
    expect(setAlertRecipients).toHaveBeenCalledWith(['a@dominodatalab.com']);
  });

  it('handleEmailAddWrapper should add valid email only', async () => {
    const alertRecipientsAddresses = ['a@dominodatalab.com', 'b@dominodatalab.com'];
    const setAlertRecipients = jest.fn();
    const emailAlertsStateAndHandlersCase = {
      ...emailAlertsStateAndHandlers,
      alertRecipients: alertRecipientsAddresses,
      alertConfigId: '',
      setAlertRecipients
    };
    jest.spyOn(alertRecipients, 'useEmailAlerts').mockReturnValue(emailAlertsStateAndHandlersCase);
    const view = render(<AlertRecipients {...emailAlertsProps} />);
    const invalidEmail = 'dominodatalab.com';
    const selectInput = view.getByRole('combobox');
    await userEvent.type(selectInput, invalidEmail);
    fireEvent.keyDown(selectInput, { key: 'enter', keyCode: 13 });
    expect(view.queryByText(invalidEmail)).toBeFalsy();
    expect(setAlertRecipients).toHaveBeenCalledTimes(0);

    const validEmail = 'c@dominodatalab.com';
    await userEvent.type(selectInput, validEmail);
    fireEvent.keyDown(selectInput, { key: 'enter', keyCode: 13 });
    expect(setAlertRecipients).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(setAlertRecipients).toHaveBeenCalledWith([...alertRecipientsAddresses, 'c@dominodatalab.com']));
  });

  it('should test parseAlertRecipients', () => {
    const alertRecipientsCases = [
      {
        testString: '',
        expectedAlertRecipients: []
      },
      {
        testString: 'a@gmail.com; b@gmail.com',
        expectedAlertRecipients: ['a@gmail.com', 'b@gmail.com']
      },
      {
        testString: 'a@gmail.com, b@gmail.com',
        expectedAlertRecipients: ['a@gmail.com', 'b@gmail.com']
      },
      {
        testString: 'p@gmail.com;a@gmail.com,a1@gmail.com, b@gmail.com; c@gmail.com',
        expectedAlertRecipients: ['p@gmail.com', 'a@gmail.com', 'a1@gmail.com', 'b@gmail.com', 'c@gmail.com']
      },
      {
        testString: 'p@gmail.com;           a@gmail.com,a1@gmail.com, b@gmail.com; c@gmail.com',
        expectedAlertRecipients: ['p@gmail.com', 'a@gmail.com', 'a1@gmail.com', 'b@gmail.com', 'c@gmail.com']
      }
    ];

    forEach(
      ({ testString, expectedAlertRecipients }) =>
        expect(alertRecipients.parseAlertRecipients(testString)).toMatchObject(expectedAlertRecipients),
      alertRecipientsCases
    );
  });
});
