import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import ComputeGridHardwareTierTable, {HardwareTierRow} from '../src/ComputeGridHardwareTierTable';

const mockHardwareTiers = [
  {
    id: "1",
    name: "test1",
    resources: {
      cores: 0.1,
      coresLimit: 0.1,
      memory: 0.1,
      memoryLimit: 0.1
    },
    gpuConfiguration: {
      numberOfGpus: 0,
      gpuKey: "nvidia.com/gpu"
    },
    clusterType: "Kubernetes",
    isDefault: true,
    centsPerMinute: 0.1,
    isFree: false,
    isAllowedDuringTrial: true,
    isVisible: true,
    isGlobal: true,
    isArchived: true,
    nodePool: "default-gpu",
    overprovisioning: {
      instances: 2,
      schedulingEnabled: false,
      daysOfWeek: ['MONDAY' , 'TUESDAY'],
      timezone: "EST",
      fromTime: "08:00:00",
      toTime: "19:00:00"
    },
    dataPlaneId: "0000000000"
  },
  {
    id: "2",
    name: "test2",
    resources: {
      cores: 0.25,
      coresLimit: 0.25,
      memory: 0.25,
      memoryLimit: 0.25
    },
    gpuConfiguration: {
      numberOfGpus: 0,
      gpuKey: "nvidia.com/gpu"
    },
    clusterType: "ClassicAWS",
    isDefault: false,
    centsPerMinute: 0.2,
    isFree: true,
    isAllowedDuringTrial: false,
    isVisible: false,
    isGlobal: false,
    nodePool: "default",
    overprovisioning: {
      instances: 2,
      schedulingEnabled: false,
      daysOfWeek: ['MONDAY' , 'TUESDAY'],
      timezone: "EST",
      fromTime: "08:00:00",
      toTime: "19:00:00"
    },
    dataPlaneId: "0000000000"
  }
] as HardwareTierRow[];

const mockCsrfToken = 'aaabbb';

describe('<ComputeGridHardwareTierTable />', () => {
  describe('Populated table where canManage === true', () => {
    const view = render(<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={true} csrfToken={mockCsrfToken}/>);
    const headerRow = view.baseElement.querySelector('thead tr');
    const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
    const infoRow1 = bodyRows[0];
    const infoRow2 = bodyRows[1];
    const infoCells = infoRow1.querySelectorAll('td');
    view.unmount();

    it ('should have the right number of rows', () => {
      expect(bodyRows.length).toEqual(2);
    })

    it ('should have the right number of cells and titles in the header', () => {
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        expect(headerCells.length).toEqual(15);
        expect(headerCells[0].textContent).toEqual("Id");
        expect(headerCells[1].textContent).toEqual("Name");
        expect(headerCells[2].textContent).toEqual("Cores");
        expect(headerCells[3].textContent).toEqual("Cores Limit");
        expect(headerCells[4].textContent).toEqual("Memory (GiB)");
        expect(headerCells[5].textContent).toEqual("Memory Limit (GiB)");
        expect(headerCells[6].textContent).toEqual("Number of GPUs");
        expect(headerCells[7].textContent).toEqual("Over-provision");
        expect(headerCells[8].textContent).toEqual("Node Pool");
        expect(headerCells[9].textContent).toEqual("Is Default");
        expect(headerCells[10].textContent).toEqual("Is Visible");
        expect(headerCells[11].textContent).toEqual("Is Global");
        expect(headerCells[12].textContent).toEqual(" ");
        expect(headerCells[13].textContent).toEqual(" ");
        expect(headerCells[14].textContent).toEqual(" ");
      }
    });

    it ('should have the right number of cells and info in the information', () => {
      expect(infoCells.length).toEqual(15);
      expect(infoCells[0].textContent).toEqual("1");
      expect(infoCells[1].textContent).toEqual("test1");
      expect(infoCells[2].textContent).toEqual("0.1");
      expect(infoCells[3].textContent).toEqual("0.1");
      expect(infoCells[4].textContent).toEqual("0.1");
      expect(infoCells[5].textContent).toEqual("0.1");
      expect(infoCells[6].textContent).toEqual("0");
      expect(infoCells[7].textContent).toEqual("2");
      expect(infoCells[8].textContent).toEqual("default-gpu");
      expect(infoCells[9].textContent).toEqual("true");
      expect(infoCells[10].textContent).toEqual("true");
      expect(infoCells[11].textContent).toEqual("true");
      expect(infoCells[12].textContent).toEqual("Edit");
      expect(infoCells[13].textContent).toEqual("Clone");
      expect(infoCells[14].textContent).toEqual("Archive");
    });

    it ('should have links for Edit, Clone and Archive where clusterType is Kubernetes', () => {
      expect(infoCells[12].textContent).toEqual("Edit");
      expect(infoCells[13].textContent).toEqual("Clone");
      expect(infoCells[14].textContent).toEqual("Archive");
    });

    it ('should have links for Archive and spans for Clone and Edit where clusterType is not Kubernetes', () => {
      const infoCells2 = infoRow2.querySelectorAll('td');
      expect(infoCells2[12].querySelectorAll('span')[0].textContent).toEqual("Edit");
      expect(infoCells2[13].querySelectorAll('span')[0].textContent).toEqual("Clone");
      expect(infoCells2[14].textContent).toEqual("Archive");
    });
  });

  describe('Populated table where canManage === true && isDominoHosted === true', () => {
    const view = render(<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={true} isDominoHosted={true} csrfToken={mockCsrfToken}/>);
    const headerRow = view.baseElement.querySelector('thead tr');
    const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
    const infoRow1 = bodyRows[0];
    const infoRow2 = bodyRows[1];
    const infoCells = infoRow1.querySelectorAll('td');
    view.unmount();

    it('should have the right number of rows', async () => {
      await waitFor(() => expect(bodyRows.length).toEqual(2));
    });

    it ('should have the right number of cells and titles in the header', () => {
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        expect(headerCells.length).toEqual(18);
        expect(headerCells[0].textContent).toEqual("Id");
        expect(headerCells[1].textContent).toEqual("Name");
        expect(headerCells[2].textContent).toEqual("Cores");
        expect(headerCells[3].textContent).toEqual("Cores Limit");
        expect(headerCells[4].textContent).toEqual("Memory (GiB)");
        expect(headerCells[5].textContent).toEqual("Memory Limit (GiB)");
        expect(headerCells[6].textContent).toEqual("Number of GPUs");
        expect(headerCells[7].textContent).toEqual("Over-provision");
        expect(headerCells[8].textContent).toEqual("Node Pool");
        expect(headerCells[9].textContent).toEqual("Is Default");
        expect(headerCells[10].textContent).toEqual("Is Visible");
        expect(headerCells[11].textContent).toEqual("Is Global");
        expect(headerCells[12].textContent).toEqual("Cents Per Minute Per Run");
        expect(headerCells[13].textContent).toEqual("Is Free");
        expect(headerCells[14].textContent).toEqual("Is Allowed During Trial");
        expect(headerCells[15].textContent).toEqual(" ");
        expect(headerCells[16].textContent).toEqual(" ");
        expect(headerCells[17].textContent).toEqual(" ");
      }
    });

    it ('should have the right number of cells and info in the information', () => {
      expect(infoCells.length).toEqual(18);
      expect(infoCells[0].textContent).toEqual("1");
      expect(infoCells[1].textContent).toEqual("test1");
      expect(infoCells[2].textContent).toEqual("0.1");
      expect(infoCells[3].textContent).toEqual("0.1");
      expect(infoCells[4].textContent).toEqual("0.1");
      expect(infoCells[5].textContent).toEqual("0.1");
      expect(infoCells[6].textContent).toEqual("0");
      expect(infoCells[7].textContent).toEqual("2");
      expect(infoCells[8].textContent).toEqual("default-gpu");
      expect(infoCells[9].textContent).toEqual("true");
      expect(infoCells[10].textContent).toEqual("true");
      expect(infoCells[11].textContent).toEqual("true");
      expect(infoCells[12].textContent).toEqual("0.1");
      expect(infoCells[13].textContent).toEqual("false");
      expect(infoCells[14].textContent).toEqual("true");
      expect(infoCells[15].textContent).toEqual("Edit");
      expect(infoCells[16].textContent).toEqual("Clone");
      expect(infoCells[17].textContent).toEqual("Archive");
    });

    it ('should have links for Edit, Clone and Archive where clusterType is Kubernetes', () => {
      expect(infoCells[15].querySelector('a')!.textContent).toEqual("Edit");
      expect(infoCells[16].querySelector('a')!.textContent).toEqual("Clone");
      expect(infoCells[17].querySelector('a')!.textContent).toEqual("Archive");
    });

    it ('should have links for Archive and spans for Clone and Edit where clusterType is not Kubernetes', () => {
      const infoCells2 = infoRow2.querySelectorAll('td');
      expect(infoCells2[15].querySelectorAll('span')[0].textContent).toEqual("Edit");
      expect(infoCells2[16].querySelectorAll('span')[0].textContent).toEqual("Clone");
      expect(infoCells2[17].querySelector('a')!.textContent).toEqual("Archive");
    });
  });

  describe('Populated table where canManage === false', () => {
    const view = render(<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={false} csrfToken={mockCsrfToken}/>);
    const headerRow = view.baseElement.querySelector('thead tr');
    const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
    const infoRow1 = bodyRows[0];
    const infoCells = infoRow1.querySelectorAll('td');
    view.unmount();

    it ('should have the right number of rows', () => {
      expect(bodyRows.length).toEqual(2)
    })

    it ('should have the right number of cells and titles in the header', () => {
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        expect(headerCells.length).toEqual(12);
        expect(headerCells[0].textContent).toEqual("Id");
        expect(headerCells[1].textContent).toEqual("Name");
        expect(headerCells[2].textContent).toEqual("Cores");
        expect(headerCells[3].textContent).toEqual("Cores Limit");
        expect(headerCells[4].textContent).toEqual("Memory (GiB)");
        expect(headerCells[5].textContent).toEqual("Memory Limit (GiB)");
        expect(headerCells[6].textContent).toEqual("Number of GPUs");
        expect(headerCells[7].textContent).toEqual("Over-provision");
        expect(headerCells[8].textContent).toEqual("Node Pool");
        expect(headerCells[9].textContent).toEqual("Is Default");
        expect(headerCells[10].textContent).toEqual("Is Visible");
        expect(headerCells[11].textContent).toEqual("Is Global");
      }
    })

    it ('should have the right number of cells and info in the information', () => {
      expect(infoCells.length).toEqual(12);
      expect(infoCells[0].textContent).toEqual("1");
      expect(infoCells[1].textContent).toEqual("test1");
      expect(infoCells[2].textContent).toEqual("0.1");
      expect(infoCells[3].textContent).toEqual("0.1");
      expect(infoCells[4].textContent).toEqual("0.1");
      expect(infoCells[5].textContent).toEqual("0.1");
      expect(infoCells[6].textContent).toEqual("0");
      expect(infoCells[7].textContent).toEqual("2");
      expect(infoCells[8].textContent).toEqual("default-gpu");
      expect(infoCells[9].textContent).toEqual("true");
      expect(infoCells[10].textContent).toEqual("true");
      expect(infoCells[11].textContent).toEqual("true");
    })
  });

  describe('Empty table where state is empty and canManage === true', () => {
    const view = render(<ComputeGridHardwareTierTable hardwareTierRows={[]} canManage={true} csrfToken={mockCsrfToken}/>);
    const headerRow = view.baseElement.querySelector('thead tr');
    const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
    const placeHolder = view.container.getElementsByClassName('ant-table-placeholder')[0];
    view.unmount();

    it ('should have the right number of rows', () => {
      expect(bodyRows.length).toEqual(0);
    });

    it ('should have the right number of cells and titles in the header', () => {
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        expect(headerCells.length).toEqual(15);
        expect(headerCells[0].textContent).toEqual("Id");
        expect(headerCells[1].textContent).toEqual("Name");
        expect(headerCells[2].textContent).toEqual("Cores");
        expect(headerCells[3].textContent).toEqual("Cores Limit");
        expect(headerCells[4].textContent).toEqual("Memory (GiB)");
        expect(headerCells[5].textContent).toEqual("Memory Limit (GiB)");
        expect(headerCells[6].textContent).toEqual("Number of GPUs");
        expect(headerCells[7].textContent).toEqual("Over-provision");
        expect(headerCells[8].textContent).toEqual("Node Pool");
        expect(headerCells[9].textContent).toEqual("Is Default");
        expect(headerCells[10].textContent).toEqual("Is Visible");
        expect(headerCells[11].textContent).toEqual("Is Global");
        expect(headerCells[12].textContent).toEqual(" ");
        expect(headerCells[13].textContent).toEqual(" ");
        expect(headerCells[14].textContent).toEqual(" ");
      }
    });

    it ('should have appropriate placeholder text', () => {
      expect(placeHolder.textContent).toEqual("Hardware Tier information will appear here");
    });
  });

  describe('Empty table where state is empty and canManage === false', () => {
    const view = render(<ComputeGridHardwareTierTable hardwareTierRows={[]} canManage={false} csrfToken={mockCsrfToken}/>);
    const headerRow = view.baseElement.querySelector('thead tr');
    const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
    const placeHolder = view.container.getElementsByClassName('ant-table-placeholder')[0];
    view.unmount();

    it ('should have the right number of rows', () => {
      expect(bodyRows.length).toEqual(0);
    });

    it ('should have the right number of cells and titles in the header', () => {
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('th');
        expect(headerCells.length).toEqual(12);
        expect(headerCells[0].textContent).toEqual("Id");
        expect(headerCells[1].textContent).toEqual("Name");
        expect(headerCells[2].textContent).toEqual("Cores");
        expect(headerCells[3].textContent).toEqual("Cores Limit");
        expect(headerCells[4].textContent).toEqual("Memory (GiB)");
        expect(headerCells[5].textContent).toEqual("Memory Limit (GiB)");
        expect(headerCells[6].textContent).toEqual("Number of GPUs");
        expect(headerCells[7].textContent).toEqual("Over-provision");
        expect(headerCells[8].textContent).toEqual("Node Pool");
        expect(headerCells[9].textContent).toEqual("Is Default");
        expect(headerCells[10].textContent).toEqual("Is Visible");
        expect(headerCells[11].textContent).toEqual("Is Global");
      }
    });

    it('should have appropriate placeholder text', () => {
      expect(placeHolder.textContent).toEqual("Hardware Tier information will appear here");
    });
  });
})
