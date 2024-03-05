import * as React from "react";
import { useRef } from "react";

type ResizeType = "top" | "bottom" | "left" | "right";
type MinSize = { width: number; height: number };
/**
 * sxx
 */
export interface ResizeProps {
  readonly children?: React.ReactNode;
  /** 类名称*/
  className?: string;
  /** 内联样式*/
  style?: React.CSSProperties;
  /** 最外面包裹的元素默认是div*/
  is?: string;
  /** 宽度和高度的最小值*/
  minSize?: Partial<MinSize> | number;
  /** 哪些边允许调整*/
  type?: ResizeType | Array<ResizeType> | "all";
  /** 调整尺寸完成后的回调*/
  onResizeEnd?: ResizeEnd<void>;
}

export enum TestEnum {
  枚举1,
  枚举2 = "test",
}
export interface ResizeProps1 {
  readonly children?: React.ReactNode;
  /**
   * 类名称
   * @default  "123456"
   */
  className?: string;
  /**
   * 内联样式
   * @deprecated 已经废弃
   */
  style?: React.CSSProperties;
  /** 最外面包裹的元素默认是div*/
  is?: string;
  /** 宽度和高度的最小值*/
  minSize?: Partial<MinSize> | number;
  /** 哪些边允许调整*/
  type?: ResizeType | Array<ResizeType> | "all";
  /** 调整尺寸完成后的回调*/
  onResizeEnd?: ResizeEnd<void>;
  /** 枚举 */
  enume: TestEnum;
}

export type ResizeEnd<T> = (rect: DOMRect) => T;
const defaultMinSize = { width: 0, height: 0 };
export const StretchResize2: React.FC<ResizeProps> = () => 123;
/**
 * 调整元素的宽高
 * @param className 类名称
 * @param style 内联样式
 * @param minSize 宽度和高度的最小值
 * @param type 哪些边允许调整
 * @param children
 * @param onResizeEnd 调整尺寸完成后的回调
 * @param is 最外面包裹的元素默认是div
 * @constructor
 */
const StretchResize: React.FC<ResizeProps> = ({
  className,
  style,
  minSize = defaultMinSize,
  type = "all",
  children,
  onResizeEnd,
  is = "div",
}) => {
  const ref = useRef<{ dragStart?: number; cssText?: string }>({});
  const drag = useRef<HTMLDivElement>(null);

  const _minSize: MinSize =
    typeof minSize == "object"
      ? { ...defaultMinSize, ...minSize }
      : { width: minSize, height: minSize };

  let _type: Array<ResizeType>;
  if (Array.isArray(type)) {
    _type = Array.from(new Set(type));
  } else if (type === "all") {
    _type = ["top", "bottom", "left", "right"];
  } else {
    _type = [type];
  }

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: string
  ) => {
    const len =
      direction === "left" || direction === "right" ? "width" : "height";
    const isRightOrBottom = direction === "right" || direction === "bottom";
    const isWidth = len === "width";

    document.body.style.userSelect = "none";
    document.body.style.cursor = isWidth ? "ew-resize" : "n-resize";

    ref.current.dragStart = isWidth ? e.clientX : e.clientY;

    ref.current.cssText = document.body.style.cssText;

    const size = drag.current!.getBoundingClientRect()[len];
    const getDimension = (e: MouseEvent) => (isWidth ? e.clientX : e.clientY);

    const moveListener = (e: MouseEvent) => {
      const diff = getDimension(e) - ref.current.dragStart!;
      const _size = isRightOrBottom ? size + diff : size - diff;
      if (_size > _minSize[len]) {
        drag.current!.style[len] = `${_size}px`;
      }
    };
    const upListener = (e: MouseEvent) => {
      document.removeEventListener("mousemove", moveListener);
      document.removeEventListener("mouseup", upListener);
      document.removeEventListener("drag", moveListener);
      document.removeEventListener("dragend", upListener);
      const diff = getDimension(e) - ref.current.dragStart!;
      const _size = isRightOrBottom ? size + diff : size - diff;
      if (_size > _minSize[len]) {
        drag.current!.style[len] = `${_size}px`;
      }
      ref.current = {};
      if (ref.current.cssText) {
        document.body.setAttribute("style", ref.current.cssText);
      } else {
        document.body.removeAttribute("style");
      }
      onResizeEnd?.(drag.current!.getBoundingClientRect());
    };
    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", upListener);
    document.addEventListener("drag", moveListener);
    document.addEventListener("dragend", upListener);
  };
  return React.createElement(
    is,
    { ref: drag, style, className },
    <>
      {children}
      {_type.map((item) => {
        return (
          <div
            key={item}
            draggable="false"
            className={"stretch-resize-drag"}
            onMouseDown={(e) => handleMouseDown(e, item)}
          />
        );
      })}
    </>
  );
};

export default StretchResize;
