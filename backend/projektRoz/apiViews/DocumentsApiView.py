from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from projektRoz.models import Documents, Child, FosterCarer
from projektRoz.serializer import DocumentsSerializer

class DocumentsApiView(APIView):
    """
    API view for managing documents.
    """

    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, document_id = None, *args, **kwargs):
        """
        Retrieve a list of documents or a specific document by ID.

        Parameters:
        - request: The HTTP request object.
        - document_id (optional): The ID of the document to retrieve.

        Returns:
        - Response: The serialized data of the documents or the specific document.
        """
        if document_id:
            document = Documents.objects.get(id = document_id)
            child = document.child
            fosterCarer = FosterCarer.objects.get(id = request.user.id)

            if child.foster_carer == fosterCarer:
                serializer = DocumentsSerializer(document, many = False)

                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            
            fosterCarer = FosterCarer.objects.get(id = request.user.id)
            children = Child.objects.filter(foster_carer = fosterCarer)
            documents = Documents.objects.all()
            ret = []

            for child in children:
                for document in documents:
                    if child == document.child:
                        ret.append(document)

            if ret != []:
                serializer = DocumentsSerializer(ret, many = True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, *args, **kwargs):
        """
        Create a new document.

        Parameters:
        - request: The HTTP request object.

        Returns:
        - Response: The serialized data of the created document.
        """
        serializer = DocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, document_id = None, *args, **kwargs):
        """
        Update an existing document.

        Parameters:
        - request: The HTTP request object.
        - document_id: The ID of the document to update.

        Returns:
        - Response: The serialized data of the updated document.
        """
        if document_id:
            document = Documents.objects.get(id = document_id)
            child = document.child
            fosterCarer = FosterCarer.objects.get(id = request.user.id)

            if child.foster_carer == fosterCarer:
                serializer = DocumentsSerializer(document, data = request.data)
                if serializer.is_valid():
                    serializer.save()

                    return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = DocumentsSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, document_id, *args, **kwargs):
        """
        Delete an existing document.

        Parameters:
        - request: The HTTP request object.
        - document_id: The ID of the document to delete.

        Returns:
        - Response: A success status indicating the document was deleted.
        """
        document = Documents.objects.get(id = document_id)
        child = document.child
        fosterCarer = FosterCarer.objects.get(id = request.user.id)
        
        if child.foster_carer == fosterCarer:
            document.delete()
            
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response(status=status.HTTP_404_NOT_FOUND)