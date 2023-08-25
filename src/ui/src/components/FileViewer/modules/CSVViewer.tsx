import * as React from 'react';
import Papa from 'papaparse';

export interface Props {
  content: string;
}

const CSVViewer = (props: Props) => {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setData(Papa.parse(props.content)?.data);
  }, [props.content]);

  return (
    <div>
      {data && data.length && <table>
        <tbody>
        {
          data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {
                row.map((column: string, colIdx: number) => (
                  <td key={colIdx}>
                    {column}
                  </td>
                ))
              }
            </tr>
          ))
        }
        </tbody>
      </table>}
    </div>
  );
};

export default CSVViewer;
