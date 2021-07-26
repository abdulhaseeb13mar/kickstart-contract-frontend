// "SPDX-License-Identifier: UNLICENSED"
pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaign;
    
    function createCampaign(uint minimum, string name) public {
        address newCampaign = new Campaign(minimum, msg.sender, name);
        deployedCampaign.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaign;
    }
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    string public CampaignName;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator, string name) public {
        manager = creator;
        minimumContribution = minimum;
        CampaignName = name;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (approvers[msg.sender] == false) {
            approversCount++;
        }
        approvers[msg.sender] = true;
    }
    
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint,uint,uint,uint,address,string
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            CampaignName
        );        
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function hasApprovedRequest(uint index, address sender) public view returns (bool) {
       Request storage request = requests[index];
       return request.approvals[sender];               
    }
}