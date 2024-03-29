import {CATEGORIES, MENU, ProductProps} from "@/utils/data/products"
import { FlatList, SectionList, Text, View } from "react-native";
import { useRef, useState } from "react";

import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import {Link} from "expo-router"
import { Product } from "@/components/product";
import { useCartStore } from "@/stores/cart-stores";

export default function Home() {
    const cartStore = useCartStore();
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    
    const sectionListRef = useRef<SectionList<ProductProps>>(null);

    const cartQuantityItems = cartStore.products.reduce((total, product) => total + product.quantity, 0)
    function handleCategorySelect(selectedCategory: string) {
        setSelectedCategory(selectedCategory);

        const sectionIndex = CATEGORIES.findIndex((category) => category === selectedCategory)
        
        if(sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                animated: true,
                sectionIndex,
                itemIndex: 0
            })
        }
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Cardápio" cartQuantityItems={cartQuantityItems}/>
            <View className="flex-row gap-4 pt-4">
                <FlatList
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    renderItem={({item}) => (
                        <CategoryButton 
                            title={item} 
                            isSelected={item === selectedCategory}
                            onPress={() => handleCategorySelect(item)} 
                        />
                    )}
                    horizontal
                    className="max-h-10"
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{gap: 12, paddingHorizontal: 20}}
                />
            </View>

            <SectionList 
                ref={sectionListRef}
                sections={MENU}
                keyExtractor={(item) => item.id}
                stickySectionHeadersEnabled={false}
                renderItem={({item}) => (
                    <Link href={`/product/${item.id}`} asChild>
                        <Product data={item} />
                    </Link>
                )}
                renderSectionHeader={({section: {title}}) => (
                    <Text className="text-xl text-white font-heading mt-8 mb-3">
                        {title}
                    </Text>
                )}
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            />
        </View>
    );
}