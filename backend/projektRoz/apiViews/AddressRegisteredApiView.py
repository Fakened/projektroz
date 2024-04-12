from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from projektRoz.models import AddressRegistered, Child, FosterCarer
from projektRoz.serializer import AddressRegisteredSerializer

class AddressRegisteredApiView(APIView):
    """
    API view for managing addresses.
    """

    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, address_registered_id=None, *args, **kwargs):
        """
        Retrieve a list of addresses or a specific address by ID.

        Parameters:
        - address_registered_id (int): Optional. The ID of the address to retrieve.

        Returns:
        - Response: The serialized address(es) in the response body.
        """
        if address_registered_id:
            address = AddressRegistered.objects.get(id=address_registered_id)
            children = Child.objects.filter(address_registered = address)
            fosterCarer = FosterCarer.objects.get(id = request.user.id)
            
            for child in children:
                if child.foster_carer == fosterCarer:
                    serializer = AddressRegisteredSerializer(address, many=False)
                    
                    return Response(serializer.data, status=status.HTTP_200_OK)
                
        else:
            fosterCarer = FosterCarer.objects.get(id = request.user.id)
            children = Child.objects.filter(foster_carer = fosterCarer)
            addresses = AddressRegistered.objects.all()
            ret = []
            
            for child in children:
                for address in addresses:
                    if child.address_registered == address:
                        ret.append(address)     
            if ret != []:
                serializer = AddressRegisteredSerializer(ret, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, *args, **kwargs):
        """
        Create a new address.

        Parameters:
        - request (Request): The HTTP request object.

        Returns:
        - Response: The serialized address in the response body if successful, or the error message if validation fails.
        """
        serializer = AddressRegisteredSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, address_registered_id = None, *args, **kwargs):
        """
        Update an existing address.

        Parameters:
        - request (Request): The HTTP request object.
        - address_registered_id (int): The ID of the address to update.

        Returns:
        - Response: The serialized address in the response body if successful, or the error message if validation fails.
        """
        if address_registered_id:
            address = AddressRegistered.objects.get(id=address_registered_id)
            children = Child.objects.filter(address_registered = address)
            fosterCarer = FosterCarer.objects.get(id = request.user.id)

            for child in children:
                if child.foster_carer == fosterCarer:
                    serializer = AddressRegisteredSerializer(address, data = request.data)
                    if serializer.is_valid():
                        serializer.save()
                    
                        return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            
            serializer = AddressRegisteredSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, address_registered_id, *args, **kwargs):
        """
        Delete an existing address.

        Parameters:
        - request (Request): The HTTP request object.
        - address_registered_id (int): The ID of the address to delete.

        Returns:
        - Response: No content if successful, or the error message if the address is not found.
        """
        address = AddressRegistered.objects.get(id=address_registered_id)
        children = Child.objects.filter(address_registered = address)
        fosterCarer = FosterCarer.objects.get(id = request.user.id)

        for child in children:
            if child.foster_carer == fosterCarer:
                address.delete()
                    
                return Response(status=status.HTTP_204_NO_CONTENT)
        
       
        return Response(status=status.HTTP_404_NOT_FOUND)