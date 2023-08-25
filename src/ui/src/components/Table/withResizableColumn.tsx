import * as React from 'react';

import { TableProps } from './Table';

/**
 * HOC to enable column resizing on a table
 * Note: this component contains direct DOM manipulations as "cleaner"
 * alternatives such as 'react-resizable' do not work as well
 * @param Table - The Table component
 */
const withResizableColumn = <T extends object>(Table: React.ComponentType<TableProps<T>>) => {
  let mouseUpHandler: any;
  let mouseDownHandler: any;
  let mouseMoveHandler: any;
  let table: HTMLTableElement | null;

  return class extends React.Component<TableProps<T>, {}> {

    ref: React.RefObject<HTMLDivElement>;

    constructor(props: TableProps<T>) {
      super(props);
      this.ref = React.createRef();
    }

    componentDidMount() {
      console.log("RESIZE")

      if (this.props.resizable !== false) {
        console.log("ENABLE RESIZE")
        this.enableResize();
      }
    }

    componentWillUnmount() {
      console.log("componentWillUnmount")
      this.removeAllListeners();
    }

    componentDidUpdate(prevProps: TableProps<any>) {
      if (this.props.columns !== prevProps.columns) {
        this.forceUpdate(() => {
          this.removeAllListeners();
          console.log("this.props.resizable", this.props.resizable)
          if (this.props.resizable !== false) {
            this.enableResize();
          }
        });
      }
    }

    removeAllListeners() {
      if (table) {
        const header = table.rows[0];
        for (let i = 0; i < header.cells.length; i++) {
          const th = header.cells[i];
          const resizeHandle = th.querySelector('.resize-handle');
          if (resizeHandle) {
            resizeHandle.removeEventListener('mousedown', mouseDownHandler);
          }
        }
        table.removeEventListener('mousemove', mouseMoveHandler);
        table.removeEventListener('mouseup', mouseUpHandler);
      }
    }

    // Find the ancestor of an element that matches a selector
    findParent(el: Element | null, selector: string): Element | null {
      if (!el) {
        return null;
      }
      if (el.closest) {
        return el.closest(selector);
      }
      // Polyfill adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
      let matches = Element.prototype.matches;
      if (!matches) {
        // @ts-ignore
        matches = Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      }
      do {
        if (matches.call(el, selector)) {
          return el;
        }
        el = (el.parentElement || el.parentNode) as Element;
      } while (el !== null && el.nodeType === 1);

      return null;
    }

    // enable resizable columns on the table component
    enableResize() {
      const me: HTMLElement | null = this.ref.current;

      console.log("ME", me)

      if (me) {
        table = me.querySelector('table');

        console.log("table", table)

        if (table && this.props.resizable !== false) {
          const header = table.rows[0];
          if (header && header.cells) {
            table.style.overflow = 'hidden';

            const self = this;
            let currentCol: any,
              startOffset: number,
              currentColWidth: number,
              tableWidth: number;

            mouseDownHandler = function (e: MouseEvent) {
              if (!table) {
                return;
              }

              currentCol = self.findParent(e.currentTarget as Element, 'th');
              currentColWidth = currentCol.offsetWidth;
              startOffset = currentColWidth - e.pageX;
              tableWidth = table.clientWidth;
            };

            mouseMoveHandler = function (e: MouseEvent) {

              window.requestAnimationFrame(() => {
                if (!table) {
                  return;
                }

                // If mouse is not being dragged, cancel the resize
                if (e.buttons !== 1) {
                  mouseUpHandler();
                  return;
                }

                if (currentCol) {
                  table.style.cursor = 'col-resize';
                  const newColWidth = startOffset + e.pageX;
                  if (newColWidth > 50) {
                    currentCol.style.width = `${newColWidth}px`;
                    // Grow the table when column is resized - it's okay to scroll horizontally
                    table.style.width = `${tableWidth + (newColWidth - currentColWidth)}px`;
                  }
                }
              });
            };

            mouseUpHandler = function (e: MouseEvent) {

              currentCol = null;
              currentColWidth = 0;
              if (table) {
                table.style.cursor = 'default';
              }
            };

            const onClickHandler = (e: MouseEvent) => {
              const target = e.target as Element;
              if (target.classList.contains('resize-handle')) {
                e.stopPropagation();
                return;
              }
            }

            for (let i = 0; i < header.cells.length; i++) {
              console.log(header.cells[i])

              const th = header.cells[i];
              const resizeHandle = th.querySelector('.resize-handle');
              if (resizeHandle) {
                resizeHandle.addEventListener('mousedown', mouseDownHandler);
              }
              th.addEventListener('click', onClickHandler);
            }
            table.addEventListener('mousemove', mouseMoveHandler);
            table.addEventListener('mouseup', mouseUpHandler);
          }
        }
      }
    }

    render() {
      return (
        <div ref={this.ref}>
          <Table
            {...this.props}
          />
        </div>
      );
    }
  };
};

export default withResizableColumn;
