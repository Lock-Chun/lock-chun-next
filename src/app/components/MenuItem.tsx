export interface MenuItemProps {
  name: string;
  quantity?: number;
  price?: number;
  spicy: boolean;
  details?: string;
  prices?: { [key: string]: number };

  // Family dinner props
  minimum_persons?: number;
  substitutions_allowed?: boolean;
  description?: string;
  base_items?: string[];
  additions_by_person?: { [key: string]: string };
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
              {item.base_items && (
                <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wide">
                    Base Items
                  </h4>
                  <div className="mb-3 p-2 bg-yellow-100 rounded text-xs font-medium text-yellow-700 border border-yellow-200">
                    Each additional person gets an added egg roll, soup, fried
                    wonton, and rice serving automatically
                  </div>
                  <div className="space-y-2">
                    {item.base_items.map((baseItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-stone-700">
                        <div className="w-1.5 h-1.5 bg-stone-400 rounded-full mr-3 flex-shrink-0"></div>
                        {baseItem}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.additions_by_person && (
                <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-3 text-sm uppercase tracking-wide">
                    Additional Items Per Person
                  </h4>
                  <div className="mb-3 p-2 bg-red-100 rounded text-xs font-medium text-red-700 border border-red-200">
                    Price increases by ${item.price} for each additional person
                  </div>
                  <div className="space-y-2">
                    {Object.entries(item.additions_by_person).map(
                      ([num, additionItem]) => (
                        <div
                          key={num}
                          className="flex items-center text-sm text-stone-700">
                          <span className="font-medium text-stone-800 mr-3 flex-shrink-0">
                            {num} people
                          </span>
                          <span className="text-stone-600">
                            +{additionItem}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
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
