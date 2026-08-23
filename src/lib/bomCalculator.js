export function calculateBOMOptimization(selectedIds, allComponents) {
  const selectedItems = allComponents.filter(c => selectedIds.includes(c.id));
  if (selectedItems.length === 0) return null;

  // 1. Split Strategy: Cheapest in-stock vendor per item
  let splitItemsCost = 0;
  const splitVendorsUsed = new Set();
  const splitBreakdown = [];

  selectedItems.forEach(item => {
    const available = item.vendors.filter(v => v.in_stock);
    if (available.length > 0) {
      const best = available.reduce((prev, curr) => curr.price < prev.price ? curr : prev);
      splitItemsCost += best.price;
      splitVendorsUsed.add(best.name);
      splitBreakdown.push({ itemId: item.id, itemName: item.name, vendor: best });
    }
  });

  // Calculate unique shipping fees for split orders
  let splitShippingCost = 0;
  splitVendorsUsed.forEach(vName => {
    const vendorInfo = selectedItems.flatMap(i => i.vendors).find(v => v.name === vName);
    splitShippingCost += vendorInfo ? vendorInfo.shipping_fee : 0;
  });

  const totalSplitCost = splitItemsCost + splitShippingCost;

  // 2. Consolidated Strategy: Vendors with all items in stock
  const allVendorNames = ["Robu.in", "Flyrobo", "ElectronicsComp", "Amazon India"];
  const consolidatedOptions = [];

  allVendorNames.forEach(vName => {
    let hasAll = true;
    let itemsTotal = 0;
    let shippingFee = 0;

    for (const item of selectedItems) {
      const vData = item.vendors.find(v => v.name === vName);
      if (!vData || !vData.in_stock) {
        hasAll = false;
        break;
      }
      itemsTotal += vData.price;
      shippingFee = vData.shipping_fee; // Single shipping fee
    }

    if (hasAll) {
      consolidatedOptions.push({
        vendorName: vName,
        totalCost: itemsTotal + shippingFee,
        itemsTotal,
        shippingFee
      });
    }
  });

  const bestConsolidated = consolidatedOptions.length > 0
    ? consolidatedOptions.reduce((prev, curr) => curr.totalCost < prev.totalCost ? curr : prev)
    : null;

  const savings = bestConsolidated ? Math.max(0, bestConsolidated.totalCost - totalSplitCost) : 0;

  return {
    split: {
      total: totalSplitCost,
      itemsCost: splitItemsCost,
      shipping: splitShippingCost,
      breakdown: splitBreakdown,
      uniqueVendorsCount: splitVendorsUsed.size
    },
    consolidated: bestConsolidated,
    savings,
    hasCompleteConsolidatedOption: !!bestConsolidated
  };
}