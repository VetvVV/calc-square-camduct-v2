import type { AtlasCategoryConfig } from '../../config/atlas'
import { ProductCategorySection } from './ProductCategorySection'

interface ProductFamilyCardProps {
  category: AtlasCategoryConfig
}

export function ProductFamilyCard({ category }: ProductFamilyCardProps) {
  return <ProductCategorySection category={category} />
}