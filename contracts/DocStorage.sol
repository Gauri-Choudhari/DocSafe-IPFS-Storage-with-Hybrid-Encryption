// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DocStorage {
    struct Doc {
        string name;
        string hash;
        address owner;
        mapping(address => string) encryptedDocKeys; // Map recipient addresses to their encrypted keys
    }

    struct DocumentInfo {
        string docHash;
        string docName;
        string encKey;
    }

    mapping(string => Doc) private doclist;
    string[] private docKeys; // Array to store keys for iteration
    uint256 public totCount = 0;

    event DocumentShared(
        string indexed documentHash,
        address indexed recipient
    );

    function addDoc(
        string memory _name,
        string memory _hash,
        string memory _encKey
    ) public {
        require(
            doclist[_hash].owner == address(0),
            "Document with this hash already exists"
        );

        Doc storage newDoc = doclist[_hash];
        newDoc.name = _name;
        newDoc.hash = _hash;
        newDoc.owner = msg.sender;
        newDoc.encryptedDocKeys[msg.sender] = _encKey;
        docKeys.push(_hash); // Add key to the array
        totCount++;
    }

    function shareDocument(
        string memory _docHash,
        address _recipient,
        string memory _encKey
    ) public {
        require(
            doclist[_docHash].owner == msg.sender,
            "You are not the owner of this document"
        );

        doclist[_docHash].encryptedDocKeys[_recipient] = _encKey;
        emit DocumentShared(_docHash, _recipient);
    }

    function getDocsOwner() public view returns (DocumentInfo[] memory) {
        // Create an array of DocumentInfo structs
        DocumentInfo[] memory docInfos = new DocumentInfo[](totCount);

        // Populate the array with document information
        for (uint256 i = 0; i < docKeys.length; i++) {
            string memory docHash = docKeys[i];
            if (doclist[docHash].owner == msg.sender) {
                docInfos[i] = DocumentInfo({
                    docHash: docHash,
                    docName: doclist[docHash].name,
                    encKey: doclist[docHash].encryptedDocKeys[msg.sender]
                });
            }
        }


        return docInfos;
    }

function getDocsShared() public view returns (DocumentInfo[] memory) {
    // Create a dynamic array to store DocumentInfo structs
    DocumentInfo[] memory docInfos = new DocumentInfo[](totCount);
    
    // Populate the array with document information
    uint256 index = 0;
    for (uint256 i = 0; i < docKeys.length; i++) {
        string memory docHash = docKeys[i];
        if (!(doclist[docHash].owner == msg.sender) ) {
            docInfos[index] = DocumentInfo({
                docHash: docHash,
                docName: doclist[docHash].name,
                encKey: doclist[docHash].encryptedDocKeys[msg.sender]
            });
            index++;
        }
    }
    
    // Resize the array to remove unused slots
    assembly {
        mstore(docInfos, index)
    }

    return docInfos;
}

}
