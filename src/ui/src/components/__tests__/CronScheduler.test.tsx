import * as React from 'react';
import 'jest-styled-components';
import { render, fireEvent, screen, within } from '@domino/test-utils/dist/testing-library';
import CronScheduler from '../CronScheduler';

describe('<CronScheduler />', () => {

  it('should render successfully with props', () => {
    const view = render(
      <CronScheduler value="" onChange={() => null} name="cronSchedule" />
    );

    expect(view.getAllByDominoTestId('cron-scheduler')).toHaveLength(1);
    expect(view.baseElement.querySelectorAll('input[name="cronSchedule"]')).toHaveLength(1);
  });

  it('should have "day" as default selection', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodSelector = view.getByDominoTestId('cron-period-selector');
    expect(cronPeriodSelector.textContent).toBe('day');
  });

  it('should render 3 fields when day is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'day' } });
    expect(within(screen.getByRole('listbox')).getByRole('option', { name: 'day' })).toBeTruthy();
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'day' }));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(3);
  });

  it('should render 2 fields when hour is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'hour' } });
    expect(screen.getByTitle('hour')).toBeTruthy();
    fireEvent.click(screen.getByTitle('hour'));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(2);
  });

  it('should render 4 fields when week is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'week' } });
    expect(screen.getByTitle('week')).toBeTruthy();
    fireEvent.click(screen.getByTitle('week'));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(4);

  });

  it('should render 3 fields when weekday is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'weekday' } });
    expect(screen.getByTitle('weekday')).toBeTruthy();
    fireEvent.click(screen.getByTitle('weekday'));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(3);
  });

  it('should render 4 fields when month is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'month' } });
    expect(screen.getByTitle('month')).toBeTruthy();
    fireEvent.click(screen.getByTitle('month'));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(4);
  });

  it('should render 5 fields when year is selected', () => {
    const view = render(
      <CronScheduler />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'year' } });
    expect(screen.getByTitle('year')).toBeTruthy();
    fireEvent.click(screen.getByTitle('year'));
    expect(view.container.getElementsByClassName('ant-select')).toHaveLength(5);
  });

  it('should call onChange when a field is updated', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'weekday' } });
    expect(screen.getByTitle('weekday')).toBeTruthy();
    fireEvent.click(screen.getByTitle('weekday'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 ? * 2-6');
  });

  it('should produce default output for hour', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'hour' } });
    expect(screen.getByTitle('hour')).toBeTruthy();
    fireEvent.click(screen.getByTitle('hour'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 * * * ?');
  });

  it('should produce default output for day', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'day' } });
    expect(within(screen.getByRole('listbox')).getByRole('option', { name: 'day' })).toBeTruthy();
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'day' }));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 * * ?');
  });

  it('should produce default output for week', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'week' } });
    expect(screen.getByTitle('week')).toBeTruthy();
    fireEvent.click(screen.getByTitle('week'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 ? * 1');
  });

  it('should produce default output for weekday', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'weekday' } });
    expect(screen.getByTitle('weekday')).toBeTruthy()
    fireEvent.click(screen.getByTitle('weekday'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 ? * 2-6');
  });

  it('should produce default output for month', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );

    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'month' } });
    expect(screen.getByTitle('month')).toBeTruthy()
    fireEvent.click(screen.getByTitle('month'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 1 * ?');
  });

  it('should produce default output for year', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'year' } });
    expect(screen.getByTitle('year')).toBeTruthy()
    fireEvent.click(screen.getByTitle('year'));
    expect(mockOnChange).toHaveBeenCalledWith('0 0 12 1 1 ?');
  });

  it('should produce correct yearly output schedule for user selected fields', () => {
    const mockOnChange = jest.fn();
    const view = render(
      <CronScheduler onChange={mockOnChange} />
    );
    const cronPeriodScheduler = view.getByDominoTestId('cron-period-selector')
    fireEvent.change(cronPeriodScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: 'year' } });
    expect(screen.getByTitle('year')).toBeTruthy()
    fireEvent.click(screen.getByTitle('year'));
    
    const cronDayScheduler = view.getByDominoTestId('cron-day-selector')
    fireEvent.change(cronDayScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: '1' } });
    expect(within(screen.getAllByRole('listbox')[1]).getByRole('option', { name: '1st' })).toBeTruthy()
    fireEvent.click(within(screen.getAllByRole('listbox')[1]).getByRole('option', { name: '1st' }));

    const cronMonthScheduler = view.getByDominoTestId('cron-month-selector')
    fireEvent.change(cronMonthScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: '2' } });
    expect(screen.getByTitle('Feb')).toBeTruthy()
    fireEvent.click(screen.getByTitle('Feb'));

    const cronHourScheduler = view.getByDominoTestId('cron-hour-selector')
    fireEvent.change(cronHourScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: '3' } });
    view.debug(undefined, 9999999)
    expect(screen.getByTitle('03')).toBeTruthy()
    fireEvent.click(screen.getByTitle('03'));

    const cronMinScheduler = view.getByDominoTestId('cron-minute-selector')
    fireEvent.change(cronMinScheduler.querySelector('.ant-select-selection-search-input') as HTMLInputElement, { target: { value: '4' } });
    expect(screen.getByTitle('04')).toBeTruthy()
    fireEvent.click(screen.getByTitle('04'));
    

    expect(mockOnChange).toHaveBeenLastCalledWith('0 4 3 1 2 ?');
  });

  it('should initialize fields when input schedule is provided', () => {
    const view = render(
      <CronScheduler value="0 10 8 21 9 ?" />
    );
    const selectItems = view.baseElement.querySelectorAll('.ant-select-selection-item');
    const period = selectItems[0].textContent;
    const dayOfMonth = selectItems[1].textContent;
    const month = selectItems[2].textContent;
    const hours = selectItems[3].textContent;
    const minutes = selectItems[4].textContent;

    expect(period).toBe('year');
    expect(dayOfMonth).toBe('21st');
    expect(month).toBe('Sep');
    expect(hours).toBe('08');
    expect(minutes).toBe('10');
  });
});
