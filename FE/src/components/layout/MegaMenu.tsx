import { megaMenu } from '../../data/menuData';

export default function MegaMenu() {
  return (
    <li className="dropdown megamenu-fw">
      <a className="dropdown-toggle" data-toggle="dropdown" href="#">
        Browse
      </a>
      <ul className="dropdown-menu megamenu-content" role="menu">
        <li>
          <div className="row">
            {megaMenu.map((col, index) => (
              <div key={index} className="col-menu col-md-3">
                <h6 className="title">
                  {col.title}{' '}
                  {col.tag && <span className="new-offer">{col.tag}</span>}
                </h6>
                <div className="content">
                  <ul className="menu-col">
                    {col.items.map((item, i) => (
                      <li key={i}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </li>
      </ul>
    </li>
  );
}
