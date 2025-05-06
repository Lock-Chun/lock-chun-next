export interface MenuItemProps {
  name: string;
  quantity?: number;
  price?: number;
  spicy: boolean;
  details?: string;
  prices?: { [key: string]: number };
}

export default function MenuItem({
  item,
  index,
}: {
  item: MenuItemProps;
  index: number;
}) {
  // If item is undefined, return null
  if (!item) {
    return null;
  }

  return (
    <li
      key={index}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-(--standardMenuMargin) border border-gray-100">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div>
              <h3 className="font-medium text-lg text-(--subforeground) flex items-center">
                {item.name}
                {item.spicy && (
                  <span
                    className="ml-2 text-red-500 select-none"
                    title="Spicy">
                    🌶️
                  </span>
                )}
              </h3>
              {item.details && (
                <p className="text-sm text-(--subtext) mt-1 leading-snug max-w-md">
                  {item.details}
                </p>
              )}
              {item.quantity && (
                <span className="inline-block bg-(--standardGray) text-(--subforeground) text-xs px-2 py-1 rounded mt-2">
                  {item.quantity} pcs
                </span>
              )}
            </div>
          </div>

          {item.price !== undefined && (
            <span className="font-semibold text-lg text-(--foreground)">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {item.prices && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(item.prices).map(([size, price]) => (
                <div
                  key={size}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-(--standardGray) text-(--subforeground)">
                  {size}: ${price.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
