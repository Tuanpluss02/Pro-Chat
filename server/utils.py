def format_ids(nested_dictionary):
    for key, value in nested_dictionary.items():
        if type(value) is dict:
            nested_dictionary[key] = format_ids(value)
        elif type(value) is list:
            new_arr = []
            for item in value:
                if type(item) is dict:
                    new_arr.append(format_ids(item))
                else:
                    new_arr.append(item)
            nested_dictionary[key] = new_arr
        else:
            if key == "_id":
                nested_dictionary[key] = str(value)
    return 