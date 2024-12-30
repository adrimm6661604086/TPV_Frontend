import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, DimensionValue } from 'react-native';

// Libraries
import FeatherIcon from 'react-native-vector-icons/Feather';

// Utils
import theme from '../utils/theme';

interface DropdownProps {
  items: { label: string; value: string; image?: any }[];
  onSelect: (item: { label: string; value: string; image?: any }) => void;
  width: DimensionValue | number;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ items, onSelect, width, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<{ label: string; value: string; image?: any } | null>(null); 

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleSelectItem = (item: { label: string; value: string; image?: any }) => {
    setSelectedItem(item); 
    setIsOpen(false); 
    if (onSelect) {
      onSelect(item); 
    }
  };

  return (
    <View style={{...styles.container, width: width}}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Image source={selectedItem?.image} style={styles.itemImage} />
        <Text style={styles.selectedLabel}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        {isOpen ? (
          <FeatherIcon name="chevron-up" size={24} color={theme.palette.primary.dark} />
        ) : (
          <FeatherIcon name="chevron-down" size={24} color={theme.palette.primary.dark} />
        )}
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownList}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelectItem(item)}
              >
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  selectedLabel: {
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 20,
    height: 20,
  },
  dropdownList: {
    position: 'absolute',
    height: 100,
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Dropdown;
