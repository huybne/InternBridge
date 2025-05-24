// src/components/layout/MegaMenuWrapper.tsx
import { MegaMenuColumn } from "../../data/menuData";
import "./megamenuwrapper.css";
interface Props {
  menu: MegaMenuColumn[];
}

export default function MegaMenuWrapper({ menu }: Props) {
  const columnCount = menu.length;
  const baseWidthPerColumn = 200; // mỗi cột chiếm ~200px
  const calculatedWidth = Math.min(columnCount * baseWidthPerColumn, 960);

  return (
    <li className="dropdown megamenu-fw">
      <a className="dropdown-toggle" data-toggle="dropdown" href="#">
        Browse
      </a>
      <ul
        className="dropdown-menu megamenu-content"
        role="menu"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "100%",
          // ❌ remove: display: "block",
          minWidth: "300px",
          maxWidth: `${calculatedWidth}px`,
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "6px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
      >
        <li>
          <div
            className="megamenu-flex-container"
            style={{
              display: "flex",
              flexWrap: "nowrap", // 👉 đảm bảo nằm ngang
              gap: "30px",
              justifyContent: "flex-start",
            }}
          >
            {menu.map((col, index) => (
              <div
                key={index}
                style={{
                  minWidth: "180px",
                  flex: "0 0 auto",
                }}
              >
                <h6 className="title" style={{ fontWeight: "bold" }}>
                  {col.title}
                  {col.tag && (
                    <span
                      className="new-offer"
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        fontSize: "10px",
                        padding: "2px 6px",
                        marginLeft: "6px",
                        borderRadius: "4px",
                      }}
                    >
                      {col.tag}
                    </span>
                  )}
                </h6>
                <ul
                  className="menu-col"
                  style={{ paddingLeft: "0", listStyle: "none" }}
                >
                  {col.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: "6px" }}>
                      <a href={item.href} style={{ color: "#333" }}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      </ul>
    </li>
  );
}
