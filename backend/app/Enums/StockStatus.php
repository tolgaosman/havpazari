<?php

namespace App\Enums;

/**
 * Ürün föyünde ve kart üzerinde gösterilen stok durumu.
 *
 * Veritabanında sütun olarak tutulmaz — `Product::stockStatus()` erişimcisi
 * `stock`/`is_order_only` alanlarından türetir (bkz. lib/filters.ts'teki
 * eşdeğer mantık, frontend'de aynı dört durumu kullanır).
 */
enum StockStatus: string
{
    case InStock = 'in_stock';
    case LowStock = 'low_stock';
    case OutOfStock = 'out_of_stock';
    case OrderOnly = 'order_only';
}
